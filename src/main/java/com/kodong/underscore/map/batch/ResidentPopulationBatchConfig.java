package com.kodong.underscore.map.batch;

import com.kodong.underscore.map.data.BusinessAttractionScoringContext;
import com.kodong.underscore.map.dto.ResidentPopulationDTO;
import com.kodong.underscore.map.entity.*;
import com.kodong.underscore.map.repository.AdministrativeDistrictRepository;
import com.kodong.underscore.map.repository.BusinessAttractionRepository;
import com.kodong.underscore.map.repository.ResidentPopulationRepository;
import com.kodong.underscore.map.util.AdministrativeCodeNormalizer;
import com.kodong.underscore.map.util.ServiceName;
import jakarta.persistence.EntityManagerFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.data.RepositoryItemReader;
import org.springframework.batch.item.database.JpaItemWriter;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Slf4j
@Configuration
public class ResidentPopulationBatchConfig {
    @Bean
    public Step residentPopulationStep(JobRepository jobRepository,
                                       PlatformTransactionManager transactionManager,
                                       ItemReader<ResidentPopulationDTO> residentPopulationReader,
                                       ItemProcessor<ResidentPopulationDTO, ResidentPopulation> residentPopulationProcessor,
                                       ItemWriter<ResidentPopulation> residentPopulationItemWriter) {
        return new StepBuilder("residentPopulationStep", jobRepository)
                .<ResidentPopulationDTO, ResidentPopulation>chunk(10, transactionManager)
                .reader(residentPopulationReader)
                .processor(residentPopulationProcessor)
                .writer(residentPopulationItemWriter)
                .build();
    }

    @Bean
    public FlatFileItemReader<ResidentPopulationDTO> residentPopulationReader() {
        FlatFileItemReader<ResidentPopulationDTO> reader = new FlatFileItemReader<>();
        reader.setResource(new ClassPathResource(ServiceName.ResidentPopulation.getCsvFileName()));
        reader.setLinesToSkip(1);

        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        tokenizer.setDelimiter(",");
        tokenizer.setNames(ServiceName.ResidentPopulation.getDataNames());

        BeanWrapperFieldSetMapper<ResidentPopulationDTO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(ResidentPopulationDTO.class);

        DefaultLineMapper<ResidentPopulationDTO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);
        return reader;
    }

    @Bean
    public ItemProcessor<ResidentPopulationDTO, ResidentPopulation> residentPopulationProcessor(AdministrativeDistrictRepository administrativeDistrictRepository, ResidentPopulationRepository residentPopulationRepository) {
        return residentPopulationDTO -> {

            String code = AdministrativeCodeNormalizer.toAdministrativeOrganizationCode(residentPopulationDTO.getAdstrdCode());

            AdministrativeDistrict dong = administrativeDistrictRepository
                    .findByAdministrativeCode(code)
                    .orElse(null);

            // 행정동이 null일 경우 확인용 로그
            if(dong == null){
                log.info("AdministrativeCode : {}    AdministrativeName : {}",residentPopulationDTO.getAdstrdCode(),residentPopulationDTO.getAdstrdCodeName());
            }
            Optional<ResidentPopulation> existing = residentPopulationRepository.findByStandardYearQuarterCodeAndAdministrativeDistrict(
                    residentPopulationDTO.getStandardYearQuarterCode(), dong
            );

            return existing.orElseGet(()->residentPopulationDTO.convertToResidentPopulation(dong, residentPopulationDTO));
        };
    }

    @Bean
    public JpaItemWriter<ResidentPopulation> residentPopulationItemWriter(EntityManagerFactory entityManagerFactory) {
        JpaItemWriter<ResidentPopulation> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);
        return writer;
    }


    @Bean
    public RepositoryItemReader<ResidentPopulation> residentPopulationItemReader(
                                            ResidentPopulationRepository residentPopulationRepository,
                                            BusinessAttractionScoringContext businessAttractionScoringContext){

        // RepositoryItemReader 설정
        RepositoryItemReader<ResidentPopulation> reader = new RepositoryItemReader<>();
        reader.setRepository(residentPopulationRepository);
        reader.setMethodName("findByStandardYearQuarterCode");
        reader.setArguments(businessAttractionScoringContext.getStandardYearQuarterCodeAsList());
        reader.setPageSize(100); // 페이지 크기 설정
        reader.setSort(Collections.singletonMap("id", Sort.Direction.ASC)); // 정렬 기준 설정

        return reader;
    }


    @Bean
    public ItemProcessor<ResidentPopulation, BusinessAttraction> residentPopulationItemProcessor(
                        BusinessAttractionRepository businessAttractionRepository,
                        BusinessAttractionScoringContext businessAttractionScoringContext){

        return residentPopulation -> {

            BusinessAttraction attraction = null;

            List<Integer> thresholds = businessAttractionScoringContext.getResidentPopulationThresholds();
            int score = calculateScore(residentPopulation.getTotalRepopCount(), thresholds);

            for(ServiceIndustry serviceIndustry : businessAttractionScoringContext.getServiceIndustryList()){

                BusinessAttractionId id = BusinessAttractionId.builder()
                        .administrativeDistrictId(residentPopulation.getAdministrativeDistrict())
                        .serviceIndustryId(serviceIndustry)
                        .standardYearQuarterCode(businessAttractionScoringContext.getStandardYearQuarterCode())
                        .build();


                Optional<BusinessAttraction> businessAttraction = businessAttractionRepository.findById(id);

                if(businessAttraction.isEmpty()) continue;

                attraction = businessAttraction.get();
                attraction.updateResidentPopulationScore(score);
            }

            return attraction;
        };
    }

    private int calculateScore(int totalRepopCount, List<Integer> thresholds) {
        if (totalRepopCount <= thresholds.get(0)) return 5;
        else if (totalRepopCount <= thresholds.get(1)) return 10;
        else if (totalRepopCount <= thresholds.get(2)) return 15;
        else return 20;
    }


}
