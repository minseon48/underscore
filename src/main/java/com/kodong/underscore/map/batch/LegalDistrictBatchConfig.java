package com.kodong.underscore.map.batch;

import com.kodong.underscore.map.dto.LegalDistrictDTO;
import com.kodong.underscore.map.entity.LegalDistrict;
import com.kodong.underscore.map.util.DataConfig;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.JpaItemWriter;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class LegalDistrictBatchConfig {
    @Bean
    public Step legalDistrictStep(JobRepository jobRepository,
                                  PlatformTransactionManager transactionManager,
                                  ItemReader<LegalDistrictDTO> legalDistrictDTOItemReader,
                                  ItemProcessor<LegalDistrictDTO, LegalDistrict> legalDistrictProcessor,
                                  ItemWriter<LegalDistrict> legalDistrictItemWriter) {
        return new StepBuilder("legalDistrictStep", jobRepository)
                .<LegalDistrictDTO, LegalDistrict>chunk(10, transactionManager)
                .reader(legalDistrictDTOItemReader)
                .processor(legalDistrictProcessor)
                .writer(legalDistrictItemWriter)
                .build();
    }

    @Bean
    public FlatFileItemReader<LegalDistrictDTO> legalDistrictDTOItemReader() {
        FlatFileItemReader<LegalDistrictDTO> reader = new FlatFileItemReader<>();
        reader.setResource(new ClassPathResource(DataConfig.LegalDistrictData.getCsvFileName()));
        reader.setLinesToSkip(1); // 첫 번째 줄(헤더) 건너뛰기

        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        tokenizer.setDelimiter(",");
        tokenizer.setNames(DataConfig.LegalDistrictData.getColumnNames());

        BeanWrapperFieldSetMapper<LegalDistrictDTO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(LegalDistrictDTO.class);

        DefaultLineMapper<LegalDistrictDTO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);
        return reader;
    }

    @Bean
    public ItemProcessor<LegalDistrictDTO, LegalDistrict> legalDistrictProcessor() {
        return dto -> {

            return dto.convertToLegalDistrict(dto);
        };
    }

    @Bean
    public JpaItemWriter<LegalDistrict> legalDistrictItemWriter(EntityManagerFactory entityManagerFactory) {
        JpaItemWriter<LegalDistrict> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);
        return writer;
    }
}
