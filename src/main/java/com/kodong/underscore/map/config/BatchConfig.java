package com.kodong.underscore.map.config;

import com.kodong.underscore.map.batch.SequentialJobListener;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.FlowBuilder;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.job.flow.Flow;
import org.springframework.batch.core.launch.support.RunIdIncrementer;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
public class BatchConfig {

    //병렬 처리를 위해 TaskExecutor 설정
    @Bean
    public TaskExecutor taskExecutor(){
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(7);
        executor.setMaxPoolSize(7);
        executor.setQueueCapacity(25);

        return executor;
    }


    @Bean
    public Job processDataInsertJob(JobRepository jobRepository,
                                    Step administrativeDistrictStep, Step serviceIndustryStep,
                                    Step storeStep, Step floatingPopulationStep, Step incomeConsumptionStep,
                                    Step indexQuarterlyQuotientStep, Step residentPopulationStep, Step sellingStep,
                                    SequentialJobListener sequentialJobListener,
                                    Step administrativeDistrictLocationUpdateStep){

        Flow dataInputFlow = new FlowBuilder<Flow>("dataInput")
                .split(taskExecutor())
                .add(new FlowBuilder<Flow>("administrativeDongFlow").start(administrativeDistrictStep).end(),
                    new FlowBuilder<Flow>("serviceIndustryFlow").start(serviceIndustryStep).end())
                .build();



        Flow parallelDataLoadFlow = new FlowBuilder<Flow>("parallelDataLoadFlow")
                .split(taskExecutor())
                .add(new FlowBuilder<Flow>("storeFlow").start(storeStep).end(),
                        new FlowBuilder<Flow>("floatingPopulationFlow").start(floatingPopulationStep).end(),
                        new FlowBuilder<Flow>("incomeConsumptionFlow").start(incomeConsumptionStep).end(),
                        new FlowBuilder<Flow>("indexQuarterlyQuotientFlow").start(indexQuarterlyQuotientStep).end(),
                        new FlowBuilder<Flow>("residentPopulationFlow").start(residentPopulationStep).end(),
                        new FlowBuilder<Flow>("sellingFlow").start(sellingStep).end())
                .build();


        Flow jobFlow = new FlowBuilder<Flow>("jobFlow")
                .start(dataInputFlow)
                .next(parallelDataLoadFlow)
                .end();


        return new JobBuilder("processDataInsertJob",jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(jobFlow)
                .next(administrativeDistrictLocationUpdateStep)
                .end()
                .listener(sequentialJobListener)
                .build();
    }


    @Bean
    public Job businessAttractionInitJob(JobRepository jobRepository, Step businessAttractionInitStep,
                                         SequentialJobListener sequentialJobListener){
        return  new JobBuilder("businessAttractionInitJob", jobRepository)
                .start(businessAttractionInitStep)
                .listener(sequentialJobListener)
                .build();
    }



    @Bean
    public Job businessAttractionUpdateJob(JobRepository jobRepository,
                                           Step businessAttractionUpdateFlpopScoreStep,
                                           Step businessAttractionUpdateIncomeConsumptionScoreStep,
                                           Step businessAttractionUpdateIndexQuarterlyQuotientScoreStep,
                                           Step businessAttractionUpdateSellingScoreStep,
                                           Step businessAttractionUpdateResidentPopulationScoreStep,
                                           Step businessAttractionUpdateStoreScoreStep){

        return new JobBuilder("businessAttractionUpdateJob",jobRepository)
                .start(businessAttractionUpdateFlpopScoreStep)
                .next(businessAttractionUpdateIncomeConsumptionScoreStep)
                .next(businessAttractionUpdateIndexQuarterlyQuotientScoreStep)
                .next(businessAttractionUpdateSellingScoreStep)
                .next(businessAttractionUpdateResidentPopulationScoreStep)
                .next(businessAttractionUpdateStoreScoreStep)
                .build();
    }

    @Bean
    public Job administrativeLocationPutJob(JobRepository jobRepository, Step administrativeDistrictLocationUpdateStep){
        return new JobBuilder("administrativeLocationPutJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(administrativeDistrictLocationUpdateStep)
                .build();
    }

}
