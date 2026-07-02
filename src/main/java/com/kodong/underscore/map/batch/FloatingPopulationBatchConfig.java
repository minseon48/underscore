package com.kodong.underscore.map.batch;

import com.kodong.underscore.map.data.BusinessAttractionScoringContext;
import com.kodong.underscore.map.dto.FloatingPopulationDTO;
import com.kodong.underscore.map.entity.*;
import com.kodong.underscore.map.repository.AdministrativeDistrictRepository;
import com.kodong.underscore.map.repository.BusinessAttractionRepository;
import com.kodong.underscore.map.repository.FloatingPopulationRepository;
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

@Configuration
@Slf4j
public class FloatingPopulationBatchConfig {

    @Bean
    public Step floatingPopulationStep(JobRepository jobRepository,
                                       PlatformTransactionManager transactionManager,
                                       ItemReader<FloatingPopulationDTO> floatingPopulationItemInputReader,
                                       ItemProcessor<FloatingPopulationDTO, FloatingPopulation> floatingPopulationProcessor,
                                       ItemWriter<FloatingPopulation> floatingPopulationItemWriter){

        return new StepBuilder("floatingPopulationStep", jobRepository)
                .<FloatingPopulationDTO,FloatingPopulation>chunk(10,transactionManager)
                .reader(floatingPopulationItemInputReader)
                .processor(floatingPopulationProcessor)
                .writer(floatingPopulationItemWriter)
                .build();
    }


    @Bean
    public FlatFileItemReader<FloatingPopulationDTO> floatingPopulationItemInputReader(){
        FlatFileItemReader<FloatingPopulationDTO> reader = new FlatFileItemReader<>();

        reader.setResource(new ClassPathResource(ServiceName.FloatingPopulation.getCsvFileName()));
        reader.setLinesToSkip(1);

        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        tokenizer.setDelimiter(",");
        tokenizer.setNames(ServiceName.FloatingPopulation.getDataNames());

        BeanWrapperFieldSetMapper<FloatingPopulationDTO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(FloatingPopulationDTO.class);

        DefaultLineMapper<FloatingPopulationDTO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);

        return reader;
    }


    @Bean
    public ItemProcessor<FloatingPopulationDTO,FloatingPopulation> floatingPopulationProcessor(AdministrativeDistrictRepository administrativeDistrictRepository, FloatingPopulationRepository floatingPopulationRepository){
        return floatingPopulationDTO -> {

            String code = AdministrativeCodeNormalizer.toAdministrativeOrganizationCode(floatingPopulationDTO.getAdstrdCode());

            AdministrativeDistrict dong =
                            administrativeDistrictRepository.findByAdministrativeCode(code)
                            .orElse(null);

            if(dong == null){
                log.info("AdministrativeCode : {}    AdministrativeName : {}",floatingPopulationDTO.getAdstrdCode(),floatingPopulationDTO.getAdstrdCodeName());
            }

            Optional<FloatingPopulation> existing = floatingPopulationRepository.findByStandardYearQuarterCodeAndAdministrativeDistrict(
                    floatingPopulationDTO.getStandardYearQuarterCode(),dong
            );

            return existing.orElseGet(() -> floatingPopulationDTO.convertToFloatingPopulation(dong,floatingPopulationDTO));
        };

    }


    @Bean
    public JpaItemWriter<FloatingPopulation> floatingPopulationItemWriter(EntityManagerFactory entityManagerFactory){
        JpaItemWriter<FloatingPopulation> writer = new JpaItemWriter<>();

        writer.setEntityManagerFactory(entityManagerFactory);

        return writer;

    }


    @Bean
    public RepositoryItemReader<FloatingPopulation> floatingPopulationItemReader(FloatingPopulationRepository floatingPopulationRepository,
                                                                                 BusinessAttractionScoringContext businessAttractionScoringContext){

        RepositoryItemReader<FloatingPopulation> reader = new RepositoryItemReader<>();
        reader.setRepository(floatingPopulationRepository);
        reader.setMethodName("findByStandardYearQuarterCode");
        reader.setArguments(businessAttractionScoringContext.getStandardYearQuarterCodeAsList());
        reader.setSort(Collections.singletonMap("id", Sort.Direction.ASC));

        return reader;
    }


    @Bean
    public ItemProcessor<FloatingPopulation, BusinessAttraction> floatingPopulationItemProcessor(BusinessAttractionRepository businessAttractionRepository,
                                                                                                 BusinessAttractionScoringContext businessAttractionScoringContext){
        return floatingPopulation -> {
            BusinessAttraction attraction = null;

            List<Integer> thresholds = businessAttractionScoringContext.getFloatingPopulationThresholds();

            int score = calculateScore(floatingPopulation.getTotFlpopCo(), thresholds);

            for(ServiceIndustry serviceIndustry : businessAttractionScoringContext.getServiceIndustryList()){
                BusinessAttractionId id = BusinessAttractionId.builder()
                        .administrativeDistrictId(floatingPopulation.getAdministrativeDistrict())
                        .serviceIndustryId(serviceIndustry)
                        .standardYearQuarterCode(businessAttractionScoringContext.getStandardYearQuarterCode())
                        .build();

                Optional<BusinessAttraction> businessAttraction = businessAttractionRepository.findById(id);

                if(businessAttraction.isEmpty()) continue;


                attraction = businessAttraction.get();

                attraction.updateFloatingPopulationScore(score);


            }

            return attraction;
        };


    }

    private int calculateScore(int totalFloatingPopulationCo, List<Integer> thresholds){
        if(totalFloatingPopulationCo <= thresholds.get(0)){
            return 5;
        }else if(totalFloatingPopulationCo <= thresholds.get(1)){
            return 10;
        }else return 15;
    }

}
