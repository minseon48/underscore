package com.kodong.underscore.map.batch;

import com.kodong.underscore.map.data.BusinessAttractionScoringContext;
import com.kodong.underscore.map.dto.SellingDTO;
import com.kodong.underscore.map.entity.*;
import com.kodong.underscore.map.repository.AdministrativeDistrictRepository;
import com.kodong.underscore.map.repository.BusinessAttractionRepository;
import com.kodong.underscore.map.repository.SellingRepository;
import com.kodong.underscore.map.repository.ServiceIndustryRepository;
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

import java.beans.PropertyEditor;
import java.beans.PropertyEditorSupport;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Configuration
public class SellingBatchConfig {
    @Bean
    public Step sellingStep(JobRepository jobRepository,
                            PlatformTransactionManager transactionManager,
                            ItemReader<SellingDTO> sellingReader,
                            ItemProcessor<SellingDTO, Selling> sellingProcessor,
                            ItemWriter<Selling> sellingItemWriter) {
        return new StepBuilder("sellingStep", jobRepository)
                .<SellingDTO, Selling>chunk(10, transactionManager)
                .reader(sellingReader)
                .processor(sellingProcessor)
                .writer(sellingItemWriter)
                .build();
    }

    @Bean
    public FlatFileItemReader<SellingDTO> sellingReader() {
        FlatFileItemReader<SellingDTO> reader = new FlatFileItemReader<>();
        reader.setResource(new ClassPathResource(ServiceName.Selling.getCsvFileName()));
        reader.setLinesToSkip(1);

        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        tokenizer.setDelimiter(",");
        tokenizer.setNames(ServiceName.Selling.getDataNames());

        BeanWrapperFieldSetMapper<SellingDTO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(SellingDTO.class);

        Map<Class<?>, PropertyEditor> customEditors = new HashMap<>();
        customEditors.put(BigDecimal.class, new PropertyEditorSupport() {
            @Override
            public void setAsText(String text) {
                setValue(new BigDecimal(text.trim()));
            }
        });
        fieldSetMapper.setCustomEditors(customEditors);

        DefaultLineMapper<SellingDTO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);
        return reader;
    }

    @Bean
    public ItemProcessor<SellingDTO, Selling> sellingProcessor(AdministrativeDistrictRepository administrativeDistrictRepository,
                                                               ServiceIndustryRepository serviceIndustryRepository, SellingRepository sellingRepository) {
        return sellingDTO -> {
            if(sellingDTO.getAdstrdCode().equals("1126062000")||sellingDTO.getAdstrdCode().equals("1126061000")){
                log.info("AdministrativeCode : {}    AdministrativeName : {} ServiceIndustryCode : {}    ServiceIndustryName : {}"
                        ,sellingDTO.getAdstrdCode(),sellingDTO.getAdstrdCodeName(),sellingDTO.getServiceIndustryCode(),sellingDTO.getServiceIndustryCodeName());
            }
            AdministrativeDistrict dong = administrativeDistrictRepository
                    .findByAdministrativeCode(sellingDTO.getAdstrdCode())
                    .orElse(null);

            ServiceIndustry industry = serviceIndustryRepository
                    .findByServiceIndustryCode(sellingDTO.getServiceIndustryCode())
                    .orElse(null);

            if(dong == null){
                log.info("AdministrativeCode : {}    AdministrativeName : {}",sellingDTO.getAdstrdCode(),sellingDTO.getAdstrdCodeName());
            }

            Optional<Selling> existing = sellingRepository.findByStandardYearQuarterCodeAndAdministrativeDistrictAndServiceIndustry(
                    sellingDTO.getStandardYearQuarterCode(),
                    dong, industry
            );

            return existing.orElseGet(() -> sellingDTO.convertToSelling(dong,industry, sellingDTO));
        };
    }

    @Bean
    public JpaItemWriter<Selling> sellingItemWriter(EntityManagerFactory entityManagerFactory) {
        JpaItemWriter<Selling> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);
        return writer;
    }


    @Bean
    public RepositoryItemReader<Selling> sellingItemReader(
                        SellingRepository repository,
                        BusinessAttractionScoringContext businessAttractionScoringContext) {

        // RepositoryItemReader 설정
        RepositoryItemReader<Selling> reader = new RepositoryItemReader<>();
        reader.setRepository(repository);
        reader.setMethodName("findByStandardYearQuarterCode");
        reader.setArguments(businessAttractionScoringContext.getStandardYearQuarterCodeAsList());
        reader.setPageSize(100); // 페이지 크기 설정
        reader.setSort(Collections.singletonMap("id", Sort.Direction.ASC)); // 정렬 기준 설정

        return reader;
    }

    @Bean
    public ItemProcessor<Selling, BusinessAttraction> sellingItemProcessor(
                        BusinessAttractionRepository businessAttractionRepository,
                        BusinessAttractionScoringContext businessAttractionScoringContext) {
        return selling -> {
            BusinessAttraction attraction = null;
            int score;
            Map<String, List<Long>> thresholds = businessAttractionScoringContext.getSellingThresholds();
            for(ServiceIndustry serviceIndustry : businessAttractionScoringContext.getServiceIndustryList()) {

                score = calculateScore(selling.getThisMonthSellingAmt(),
                        thresholds.get(serviceIndustry.getServiceIndustryCode()));


                BusinessAttractionId id = BusinessAttractionId.builder()
                        .administrativeDistrictId(selling.getAdministrativeDistrict())
                        .serviceIndustryId(serviceIndustry)
                        .standardYearQuarterCode(businessAttractionScoringContext.getStandardYearQuarterCode())
                        .build();

                Optional<BusinessAttraction> businessAttraction = businessAttractionRepository.findById(id);

                if (businessAttraction.isEmpty()) continue;


                attraction = businessAttraction.get();

                attraction.updateSellingScore(score);

            }

            return attraction;
        };
    }

    private int calculateScore(BigDecimal thisMonSellingAmt, List<Long> thresholds) {
        if (thisMonSellingAmt.compareTo(BigDecimal.valueOf(thresholds.get(0))) <= 0) return 5;
        else if (thisMonSellingAmt.compareTo(BigDecimal.valueOf(thresholds.get(1))) <= 0) return 10;
        else if (thisMonSellingAmt.compareTo(BigDecimal.valueOf(thresholds.get(2))) <= 0) return 15;
        else return 20;
    }
}
