package com.kodong.underscore.map.batch;

import com.kodong.underscore.map.data.BusinessAttractionScoringContext;
import com.kodong.underscore.map.dto.IncomeConsumptionDTO;
import com.kodong.underscore.map.entity.*;
import com.kodong.underscore.map.repository.AdministrativeDistrictRepository;
import com.kodong.underscore.map.repository.BusinessAttractionRepository;
import com.kodong.underscore.map.repository.IncomeConsumptionRepository;
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
public class IncomeConsumptionBatchConfig {

    @Bean
    public Step incomeConsumptionStep(JobRepository jobRepository,
                                      PlatformTransactionManager transactionManager,
                                      ItemReader<IncomeConsumptionDTO> incomeConsumptionReader,
                                      ItemProcessor<IncomeConsumptionDTO, IncomeConsumption> incomeConsumptionProcessor,
                                      ItemWriter<IncomeConsumption> incomeConsumptionItemWriter){

        return new StepBuilder("incomeConsumptionStep",jobRepository)
                .<IncomeConsumptionDTO,IncomeConsumption>chunk(10,transactionManager)
                .reader(incomeConsumptionReader)
                .processor(incomeConsumptionProcessor)
                .writer(incomeConsumptionItemWriter)
                .build();
    }


    @Bean
    public FlatFileItemReader<IncomeConsumptionDTO> incomeConsumptionReader(){
        FlatFileItemReader<IncomeConsumptionDTO> reader = new FlatFileItemReader<>();

        reader.setResource(new ClassPathResource(ServiceName.IncomeConsumption.getCsvFileName()));
        reader.setLinesToSkip(1);

        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        tokenizer.setDelimiter(",");
        tokenizer.setNames(ServiceName.IncomeConsumption.getDataNames());


        BeanWrapperFieldSetMapper<IncomeConsumptionDTO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(IncomeConsumptionDTO.class);

        DefaultLineMapper<IncomeConsumptionDTO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);

        return reader;
    }


    @Bean
    public ItemProcessor<IncomeConsumptionDTO,IncomeConsumption> incomeConsumptionProcessor(AdministrativeDistrictRepository administrativeDistrictRepository, IncomeConsumptionRepository incomeConsumptionRepository){
        return incomeConsumptionDTO -> {
            AdministrativeDistrict dong = administrativeDistrictRepository
                    .findByAdministrativeCode(incomeConsumptionDTO.getAdstrdCode())
                    .orElse(null);

            // 행정동이 null일 경우 확인용 로그
            if(dong == null){
                log.info("AdministrativeCode : {}    AdministrativeName : {}",incomeConsumptionDTO.getAdstrdCode(),incomeConsumptionDTO.getAdstrdCodeName());
            }

            Optional<IncomeConsumption> existing = incomeConsumptionRepository.findByStandardYearQuarterCodeAndAdministrativeDistrict(
                    incomeConsumptionDTO.getStandardYearQuarterCode(), dong
            );

            // convertToStore 메서드를 호출하여 IncomeConsumption Entity로 변환
            return existing.orElseGet(()->incomeConsumptionDTO.convertToIncomeConsumption(dong, incomeConsumptionDTO));
        };
    }


    @Bean
    public JpaItemWriter<IncomeConsumption> incomeConsumptionItemWriter(EntityManagerFactory entityManagerFactory){
        JpaItemWriter<IncomeConsumption> writer = new JpaItemWriter<>();

        writer.setEntityManagerFactory(entityManagerFactory);

        return writer;
    }


    @Bean
    public RepositoryItemReader<IncomeConsumption> incomeConsumptionItemReader(
                                                    IncomeConsumptionRepository incomeConsumptionRepository,
                                                    BusinessAttractionScoringContext businessAttractionScoringContext){

        RepositoryItemReader<IncomeConsumption> reader = new RepositoryItemReader<>();
        reader.setRepository(incomeConsumptionRepository);
        reader.setMethodName("findByStandardYearQuarterCode");
        reader.setArguments(businessAttractionScoringContext.getStandardYearQuarterCodeAsList());
        reader.setPageSize(100);
        reader.setSort(Collections.singletonMap("id", Sort.Direction.ASC));

        return reader;
    }


    @Bean
    public ItemProcessor<IncomeConsumption, BusinessAttraction> incomeConsumptionItemProcessor(
                                                            BusinessAttractionRepository businessAttractionRepository,
                                                            BusinessAttractionScoringContext businessAttractionScoringContext){
        return incomeConsumption -> {
            BusinessAttraction attraction = null;

            List<Long> thresholds = businessAttractionScoringContext.getIncomeConsumptionThresholds();

            int score = calculateScore(incomeConsumption.getFoodExpenditureAmount(), thresholds);

            for(ServiceIndustry serviceIndustry : businessAttractionScoringContext.getServiceIndustryList()){
                BusinessAttractionId id = BusinessAttractionId.builder()
                        .administrativeDistrictId(incomeConsumption.getAdministrativeDistrict())
                        .serviceIndustryId(serviceIndustry)
                        .standardYearQuarterCode(businessAttractionScoringContext.getStandardYearQuarterCode())
                        .build();


                Optional<BusinessAttraction> businessAttraction = businessAttractionRepository.findById(id);

                if(businessAttraction.isEmpty()){
                    continue;
                }

                attraction = businessAttraction.get();

                attraction.updateIncomeConsumptionScore(score);
            }

            return attraction;
        };
    }

    private int calculateScore(long foodExpenditureAmount, List<Long> thresholds) {
        if(foodExpenditureAmount <= thresholds.get(0)) return 5;
        else if(foodExpenditureAmount <= thresholds.get(1)) return 10;
        else return 15;
    }
}

