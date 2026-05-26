package com.kodong.underscore.map.batch;

import com.kodong.underscore.map.data.BusinessAttractionScoringContext;
import com.kodong.underscore.map.dto.StoreDTO;
import com.kodong.underscore.map.entity.*;
import com.kodong.underscore.map.repository.AdministrativeDistrictRepository;
import com.kodong.underscore.map.repository.BusinessAttractionRepository;
import com.kodong.underscore.map.repository.ServiceIndustryRepository;
import com.kodong.underscore.map.repository.StoreRepository;
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
import java.util.Map;
import java.util.Optional;

@Slf4j
@Configuration
public class StoreBatchConfig {
    @Bean
    public Step storeStep(JobRepository jobRepository,
                          PlatformTransactionManager transactionManager,
                          ItemReader<StoreDTO> storeReader,
                          ItemProcessor<StoreDTO, Store> storeProcessor,
                          ItemWriter<Store> storeItemWriter) {
        return new StepBuilder("storeStep", jobRepository)
                .<StoreDTO, Store>chunk(10, transactionManager)
                .reader(storeReader)
                .processor(storeProcessor)
                .writer(storeItemWriter)
                .build();
    }

    @Bean
    public FlatFileItemReader<StoreDTO> storeReader() {
        FlatFileItemReader<StoreDTO> reader = new FlatFileItemReader<>();
        reader.setResource(new ClassPathResource(ServiceName.Store.getCsvFileName()));
        reader.setLinesToSkip(1);

        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        tokenizer.setDelimiter(",");
        tokenizer.setNames(ServiceName.Store.getDataNames());

        BeanWrapperFieldSetMapper<StoreDTO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(StoreDTO.class);

        DefaultLineMapper<StoreDTO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);
        return reader;
    }

    @Bean
    public ItemProcessor<StoreDTO, Store> storeProcessor(AdministrativeDistrictRepository administrativeDistrictRepository,
                                                         ServiceIndustryRepository serviceIndustryRepository, StoreRepository storeRepository) {
        return storeDTO -> {

            AdministrativeDistrict dong = administrativeDistrictRepository
                    .findByAdministrativeCode(storeDTO.getAdstrdCode())
                    .orElse(null);

            ServiceIndustry industry = serviceIndustryRepository
                    .findByServiceIndustryCode(storeDTO.getServiceIndustryCode())
                    .orElse(null);

            //행정동이 null일 경우 확인용 로그
            if(dong == null){
                log.info("AdministrativeCode : {}    AdministrativeName : {}",storeDTO.getAdstrdCode(),storeDTO.getAdstrdCodeName());
            }

            Optional<Store> existing = storeRepository.findByStandardYearQuarterCodeAndAdministrativeDistrictAndServiceIndustry(
                    storeDTO.getStandardYearQuarterCode(),
                    dong, industry
            );

            return existing.orElseGet(()->storeDTO.convertToStore(dong,industry, storeDTO));
        };
    }

    @Bean
    public JpaItemWriter<Store> storeItemWriter(EntityManagerFactory entityManagerFactory) {
        JpaItemWriter<Store> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);
        return writer;
    }


    @Bean
    public RepositoryItemReader<Store> storeItemReader(
                                    StoreRepository repository,
                                    BusinessAttractionScoringContext businessAttractionScoringContext) {

        // RepositoryItemReader 설정
        RepositoryItemReader<Store> reader = new RepositoryItemReader<>();
        reader.setRepository(repository);
        reader.setMethodName("findByStandardYearQuarterCode");
        reader.setArguments(businessAttractionScoringContext.getStandardYearQuarterCodeAsList());
        reader.setPageSize(100); // 페이지 크기 설정
        reader.setSort(Collections.singletonMap("id", Sort.Direction.ASC)); // 정렬 기준 설정

        return reader;
    }

    @Bean
    public ItemProcessor<Store, BusinessAttraction> storeItemProcessor(
                                                    BusinessAttractionRepository businessAttractionRepository,
                                                    BusinessAttractionScoringContext businessAttractionScoringContext) {
        return store -> {
            BusinessAttraction attraction = null;
            int score;
            Map<String, List<Integer>> thresholds = businessAttractionScoringContext.getStoreThresholds();
            for(ServiceIndustry serviceIndustry : businessAttractionScoringContext.getServiceIndustryList()) {

                score = calculateScore(store.getSimilarIndustryStoreCount(),
                        thresholds.get(serviceIndustry.getServiceIndustryCode()));

                BusinessAttractionId id = BusinessAttractionId.builder()
                        .administrativeDistrictId(store.getAdministrativeDistrict())
                        .serviceIndustryId(serviceIndustry)
                        .standardYearQuarterCode(businessAttractionScoringContext.getStandardYearQuarterCode())
                        .build();

                // Repository에서 BusinessAttraction 엔티티 조회
                Optional<BusinessAttraction> businessAttraction = businessAttractionRepository.findById(id);

                // Optional이 비어있으면 continue를 사용하여 루프의 다음 반복으로 넘어갑니다.
                if (businessAttraction.isEmpty()) continue;


                attraction = businessAttraction.get();

                attraction.updateStoreScore(score);

            }

            return attraction;
        };
    }

    private int calculateScore(long similarIndustryStoreCount,List<Integer>  thresholds) {
        if (similarIndustryStoreCount <= thresholds.get(0)) {
            return 5;
        } else if (similarIndustryStoreCount <= thresholds.get(1)) {
            return 10;
        } else {
            return 15;
        }
    }

}
