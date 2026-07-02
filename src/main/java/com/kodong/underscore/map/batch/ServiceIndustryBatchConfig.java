package com.kodong.underscore.map.batch;

import com.kodong.underscore.map.dto.ServiceIndustryDTO;
import com.kodong.underscore.map.entity.ServiceIndustry;
import com.kodong.underscore.map.repository.ServiceIndustryRepository;
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

import java.util.Optional;

@Configuration
public class ServiceIndustryBatchConfig {
    @Bean
    public Step serviceIndustryStep(JobRepository jobRepository,
                                    PlatformTransactionManager transactionManager,
                                    ItemReader<ServiceIndustryDTO> serviceIndustryDTOItemReader,
                                    ItemProcessor<ServiceIndustryDTO, ServiceIndustry> serviceIndustryProcessor,
                                    ItemWriter<ServiceIndustry> serviceIndustryItemWriter) {
        return new StepBuilder("serviceIndustryStep", jobRepository)
                .<ServiceIndustryDTO, ServiceIndustry>chunk(10, transactionManager)
                .reader(serviceIndustryDTOItemReader)
                .processor(serviceIndustryProcessor)
                .writer(serviceIndustryItemWriter)
                .build();
    }

    @Bean
    public FlatFileItemReader<ServiceIndustryDTO> serviceIndustryDTOItemReader() {
        FlatFileItemReader<ServiceIndustryDTO> reader = new FlatFileItemReader<>();
        reader.setResource(new ClassPathResource(DataConfig.ServiceIndustry.getCsvFileName()));
        reader.setLinesToSkip(1);

        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        tokenizer.setDelimiter(",");
        tokenizer.setNames(DataConfig.ServiceIndustry.getColumnNames());

        BeanWrapperFieldSetMapper<ServiceIndustryDTO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(ServiceIndustryDTO.class);

        DefaultLineMapper<ServiceIndustryDTO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);
        return reader;
    }

    @Bean
    public ItemProcessor<ServiceIndustryDTO, ServiceIndustry> serviceIndustryProcessor(ServiceIndustryRepository serviceIndustryRepository) {
        return dto -> {

            Optional<ServiceIndustry> existing = serviceIndustryRepository.findByServiceIndustryCode(dto.getServiceIndustryCode());
            return existing.orElseGet(() -> dto.convertToServiceIndustry(dto));
        };
    }

    @Bean
    public JpaItemWriter<ServiceIndustry> serviceIndustryItemWriter(EntityManagerFactory entityManagerFactory) {
        JpaItemWriter<ServiceIndustry> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);
        return writer;
    }

}
