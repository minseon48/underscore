package com.kodong.underscore.map.batch;

import com.kodong.underscore.map.data.BusinessAttractionScoringContext;
import com.kodong.underscore.map.entity.*;
import com.kodong.underscore.map.repository.BusinessAttractionRepository;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class BusinessAttractionBatchConfig {

    @Bean
    public Step businessAttractionInitStep(JobRepository jobRepository,
                                           PlatformTransactionManager transactionManager,
                                           ItemReader<AdministrativeDistrict> administrativeDistrictRepositoryItemReader,
                                           ItemProcessor<AdministrativeDistrict, List<BusinessAttraction>> businessAttractionProcessor,
                                           ItemWriter<List<BusinessAttraction>> businessAttractionItemListWriter){

        return new StepBuilder("businessAttractionInitStep", jobRepository)
                .<AdministrativeDistrict, List<BusinessAttraction>>chunk(10,transactionManager)
                .reader(administrativeDistrictRepositoryItemReader)
                .processor(businessAttractionProcessor)
                .writer(businessAttractionItemListWriter)
                .build();
    }


    @Bean
    public Step businessAttractionUpdateFlpopScoreStep(JobRepository jobRepository,
                                                       PlatformTransactionManager transactionManager,
                                                       ItemReader<FloatingPopulation> floatingPopulationItemReader,
                                                       ItemProcessor<FloatingPopulation,BusinessAttraction> floatingPopulationItemProcessor,
                                                       ItemWriter<BusinessAttraction> businessAttractionItemWriter){

        return new StepBuilder("businessAttractionUpdateFlpopScoreStep",jobRepository)
                .<FloatingPopulation,BusinessAttraction>chunk(10,transactionManager)
                .reader(floatingPopulationItemReader)
                .processor(floatingPopulationItemProcessor)
                .writer(businessAttractionItemWriter)
                .build();
    }



    @Bean
    public Step businessAttractionUpdateIncomeConsumptionScoreStep(JobRepository jobRepository,
                                                                   PlatformTransactionManager transactionManager,
                                                                   ItemReader<IncomeConsumption> incomeConsumptionItemReader,
                                                                   ItemProcessor<IncomeConsumption,BusinessAttraction> incomeConsumptionItemProcessor,
                                                                   ItemWriter<BusinessAttraction> businessAttractionItemWriter){

        return new StepBuilder("businessAttractionUpdateIncomeConsumptionScoreStep",jobRepository)
                .<IncomeConsumption,BusinessAttraction>chunk(10,transactionManager)
                .reader(incomeConsumptionItemReader)
                .processor(incomeConsumptionItemProcessor)
                .writer(businessAttractionItemWriter)
                .build();
    }

    @Bean
    public Step businessAttractionUpdateIndexQuarterlyQuotientScoreStep(JobRepository jobRepository,
                                                                        PlatformTransactionManager transactionManager,
                                                                        ItemReader<IndexQuarterlyQuotient> indexQuarterlyQuotientItemReader,
                                                                        ItemProcessor<IndexQuarterlyQuotient,BusinessAttraction> indexQuarterlyQuotientItemProcessor,
                                                                        ItemWriter<BusinessAttraction> businessAttractionItemWriter) {
        return new StepBuilder("businessAttractionUpdateIndexQuarterlyQuotientScoreStep",jobRepository)
                .<IndexQuarterlyQuotient,BusinessAttraction>chunk(10,transactionManager)
                .reader(indexQuarterlyQuotientItemReader)
                .processor(indexQuarterlyQuotientItemProcessor)
                .writer(businessAttractionItemWriter)
                .build();
    }

    @Bean
    public Step businessAttractionUpdateSellingScoreStep(JobRepository jobRepository,
                                                         PlatformTransactionManager transactionManager,
                                                         ItemReader<Selling> sellingItemReader,
                                                         ItemProcessor<Selling,BusinessAttraction> sellingItemProcessor,
                                                         ItemWriter<BusinessAttraction> businessAttractionItemWriter) {
        return new StepBuilder("businessAttractionUpdateSellingScoreStep",jobRepository)
                .<Selling,BusinessAttraction>chunk(10,transactionManager)
                .reader(sellingItemReader)
                .processor(sellingItemProcessor)
                .writer(businessAttractionItemWriter)
                .build();
    }

    @Bean
    public Step businessAttractionUpdateResidentPopulationScoreStep(JobRepository jobRepository,
                                                                    PlatformTransactionManager transactionManager,
                                                                    ItemReader<ResidentPopulation> residentPopulationItemReader,
                                                                    ItemProcessor<ResidentPopulation,BusinessAttraction> residentPopulationItemProcessor,
                                                                    ItemWriter<BusinessAttraction> businessAttractionItemWriter) {
        return new StepBuilder("businessAttractionUpdateResidentPopulationScoreStep",jobRepository)
                .<ResidentPopulation,BusinessAttraction>chunk(10,transactionManager)
                .reader(residentPopulationItemReader)
                .processor(residentPopulationItemProcessor)
                .writer(businessAttractionItemWriter)
                .build();
    }

    @Bean
    public Step businessAttractionUpdateStoreScoreStep(JobRepository jobRepository,
                                                       PlatformTransactionManager transactionManager,
                                                       ItemReader<Store> storeItemReader,
                                                       ItemProcessor<Store,BusinessAttraction> storeItemProcessor,
                                                       ItemWriter<BusinessAttraction> businessAttractionItemWriter) {
        return new StepBuilder("businessAttractionUpdateStoreScoreStep",jobRepository)
                .<Store,BusinessAttraction>chunk(10,transactionManager)
                .reader(storeItemReader)
                .processor(storeItemProcessor)
                .writer(businessAttractionItemWriter)
                .build();
    }


    @Bean
    public ItemProcessor<AdministrativeDistrict,List<BusinessAttraction>> businessAttractionProcessor(BusinessAttractionRepository businessAttractionRepository,
                                                                                                      BusinessAttractionScoringContext businessAttractionScoringContext){

        return administrativeDistrict -> {
            List<ServiceIndustry> serviceIndustries = businessAttractionScoringContext.getServiceIndustryList();

            List<BusinessAttraction> businessAttractions = new ArrayList<>();

            String standardYearQuarterCode = businessAttractionScoringContext.getStandardYearQuarterCode();


            // 각 AdministrativeDistrict에 대해 모든 ServiceIndustry와 조합하여 BusinessAttraction 객체를 생성합니다.
            for(ServiceIndustry serviceIndustry : serviceIndustries){
                BusinessAttraction businessAttraction = new BusinessAttraction(
                                administrativeDistrict,
                                serviceIndustry,
                                standardYearQuarterCode
                );


                businessAttractions.add(businessAttraction);
            }

            return businessAttractions;
        };

    }



    @Bean
    public ItemWriter<List<BusinessAttraction>> businessAttractionItemListWriter(BusinessAttractionRepository businessAttractionRepository){
        return items -> {
            for(List<BusinessAttraction> chunk : items){
                businessAttractionRepository.saveAll(chunk);
            }
        };
    }


    @Bean
    public JpaItemWriter<BusinessAttraction> businessAttractionItemWriter(EntityManagerFactory entityManagerFactory){
        JpaItemWriter<BusinessAttraction> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);

        return writer;
    }


}
