package com.kodong.underscore.map.batch;

import com.kodong.underscore.map.data.BusinessAttractionScoringContext;
import com.kodong.underscore.map.dto.IndexQuarterlyQuotientDTO;
import com.kodong.underscore.map.entity.*;
import com.kodong.underscore.map.repository.AdministrativeDistrictRepository;
import com.kodong.underscore.map.repository.BusinessAttractionRepository;
import com.kodong.underscore.map.repository.IndexQuarterlyQuotientRepository;
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
public class IndexQuarterlyQuotientBatchConfig {

    @Bean
    public Step indexQuarterlyQuotientStep(JobRepository jobRepository,
                                           PlatformTransactionManager transactionManager,
                                           ItemReader<IndexQuarterlyQuotientDTO> indexQuarterlyQuotientReader,
                                           ItemProcessor<IndexQuarterlyQuotientDTO, IndexQuarterlyQuotient> indexQuarterlyQuotientProcessor,
                                           ItemWriter<IndexQuarterlyQuotient> indexQuarterlyQuotientItemWriter) {
        return new StepBuilder("indexQuarterlyQuotientStep", jobRepository)
                .<IndexQuarterlyQuotientDTO, IndexQuarterlyQuotient>chunk(10, transactionManager)
                .reader(indexQuarterlyQuotientReader)
                .processor(indexQuarterlyQuotientProcessor)
                .writer(indexQuarterlyQuotientItemWriter)
                .build();
    }

    @Bean
    public FlatFileItemReader<IndexQuarterlyQuotientDTO> indexQuarterlyQuotientReader() {
        FlatFileItemReader<IndexQuarterlyQuotientDTO> reader = new FlatFileItemReader<>();
        reader.setResource(new ClassPathResource(ServiceName.IndexQuarterlyQuotient.getCsvFileName()));
        reader.setLinesToSkip(1); // 첫 번째 줄(헤더) 건너뛰기

        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        tokenizer.setDelimiter(",");
        tokenizer.setNames(ServiceName.IndexQuarterlyQuotient.getDataNames());

        BeanWrapperFieldSetMapper<IndexQuarterlyQuotientDTO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(IndexQuarterlyQuotientDTO.class);

        DefaultLineMapper<IndexQuarterlyQuotientDTO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);
        return reader;
    }

    @Bean
    public ItemProcessor<IndexQuarterlyQuotientDTO, IndexQuarterlyQuotient> indexQuarterlyQuotientProcessor(AdministrativeDistrictRepository administrativeDistrictRepository, IndexQuarterlyQuotientRepository indexQuarterlyQuotientRepository) {
        return indexQuarterlyQuotientDTO -> {
            String code = AdministrativeCodeNormalizer.toAdministrativeOrganizationCode(indexQuarterlyQuotientDTO.getAdstrdCode());

            AdministrativeDistrict dong = administrativeDistrictRepository
                    .findByAdministrativeCode(code)
                    .orElse(null);

            // 행정동이 null일 경우 확인용 로그
            if(dong == null){
                log.info("AdministrativeCode : {}    AdministrativeName : {}", indexQuarterlyQuotientDTO.getAdstrdCode(),indexQuarterlyQuotientDTO.getAdstrdCodeName());
            }

            Optional<IndexQuarterlyQuotient> existing = indexQuarterlyQuotientRepository.findByStandardYearQuarterCodeAndAdministrativeDistrict(
                    indexQuarterlyQuotientDTO.getStandardYearQuarterCode(), dong
            );

            return existing.orElseGet(()-> indexQuarterlyQuotientDTO.convertToIndxQuarterlyQuotient(dong, indexQuarterlyQuotientDTO));
        };
    }

    @Bean
    public JpaItemWriter<IndexQuarterlyQuotient> indexQuarterlyQuotientItemWriter(EntityManagerFactory entityManagerFactory) {
        JpaItemWriter<IndexQuarterlyQuotient> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);
        return writer;
    }


    @Bean
    public RepositoryItemReader<IndexQuarterlyQuotient> indexQuarterlyQuotientItemReader(
                                                    IndexQuarterlyQuotientRepository indexQuarterlyQuotientRepository,
                                                    BusinessAttractionScoringContext businessAttractionScoringContext){
        RepositoryItemReader<IndexQuarterlyQuotient> reader = new RepositoryItemReader<>();
        reader.setRepository(indexQuarterlyQuotientRepository);
        reader.setMethodName("findByStandardYearQuarterCode");
        reader.setArguments(businessAttractionScoringContext.getStandardYearQuarterCodeAsList());
        reader.setPageSize(100); // 페이지 크기 설정
        reader.setSort(Collections.singletonMap("id", Sort.Direction.ASC));

        return reader;

    }


    @Bean
    public ItemProcessor<IndexQuarterlyQuotient, BusinessAttraction> indexQuarterlyQuotientItemProcessor(
                        BusinessAttractionRepository businessAttractionRepository,
                        BusinessAttractionScoringContext businessAttractionScoringContext){

        return indexQuarterlyQuotient -> {
            BusinessAttraction attraction = null;

            int score;
            List<String> thresholds = businessAttractionScoringContext.getIndexQuarterlyQuotientThresholds();

            for(ServiceIndustry serviceIndustry : businessAttractionScoringContext.getServiceIndustryList()){
                score = calculateScore(indexQuarterlyQuotient.getTradeAreaChangeIndex(), thresholds);

                BusinessAttractionId id = BusinessAttractionId.builder()
                        .administrativeDistrictId(indexQuarterlyQuotient.getAdministrativeDistrict())
                        .serviceIndustryId(serviceIndustry)
                        .standardYearQuarterCode(businessAttractionScoringContext.getStandardYearQuarterCode())
                        .build();


                Optional<BusinessAttraction> businessAttraction = businessAttractionRepository.findById(id);

                if(businessAttraction.isEmpty()) continue;

                attraction = businessAttraction.get();
                attraction.updateIndexQuarterlyQuotientScore(score);
            }

            return attraction;
        };
    }

    private int calculateScore(String tradeAreaChangeIndex, List<String> thresholds) {
        if (tradeAreaChangeIndex.equals(thresholds.get(0))) return 5;

        if (tradeAreaChangeIndex.equals(thresholds.get(1))) return 10;

        if (tradeAreaChangeIndex.equals(thresholds.get(2))) return 15;

        return 20;
    }


}
