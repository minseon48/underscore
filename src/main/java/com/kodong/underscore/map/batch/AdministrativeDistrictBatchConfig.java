package com.kodong.underscore.map.batch;


import com.kodong.underscore.map.data.SGIS.AddressToLocationDTO;
import com.kodong.underscore.map.data.SGIS.AdministrativeDistrictLocationMaker;
import com.kodong.underscore.map.dto.AdministrativeDistrictAddressDTO;
import com.kodong.underscore.map.dto.AdministrativeDistrictDTO;
import com.kodong.underscore.map.entity.AdministrativeDistrict;
import com.kodong.underscore.map.repository.AdministrativeDistrictRepository;
import com.kodong.underscore.map.util.DataConfig;
import jakarta.persistence.EntityManagerFactory;
import lombok.Builder;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.batch.item.database.BeanPropertyItemSqlParameterSourceProvider;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.database.JpaItemWriter;
import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.batch.item.file.mapping.DefaultLineMapper;
import org.springframework.batch.item.file.transform.DelimitedLineTokenizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.Optional;

@Configuration
public class AdministrativeDistrictBatchConfig {


    @Bean
    public Step administrativeDistrictStep(JobRepository jobRepository,
                                          PlatformTransactionManager transactionManager,
                                          ItemReader<AdministrativeDistrictDTO> administrativeDistrictDTOItemReader,
                                          ItemProcessor<AdministrativeDistrictDTO, AdministrativeDistrict> administrativeDistrictProcessor,
                                           ItemWriter<AdministrativeDistrict> administrativeDistrictItemWriter){
        return new StepBuilder("administrativeDistrictStep",jobRepository)
                .<AdministrativeDistrictDTO,AdministrativeDistrict>chunk(10,transactionManager)
                .reader(administrativeDistrictDTOItemReader)
                .processor(administrativeDistrictProcessor)
                .writer(administrativeDistrictItemWriter)
                .build();
    }


    @Bean
    public Step administrativeDistrictLocationUpdateStep(JobRepository jobRepository,
                                                         PlatformTransactionManager transactionManager,
                                                         ItemReader<AdministrativeDistrictAddressDTO> administrativeDistrictAddressDTOItemReader,
                                                         ItemProcessor<AdministrativeDistrictAddressDTO, AddressToLocationDTO> administrativeDistrictAddressProcessor,
                                                         ItemWriter<AddressToLocationDTO> administrativeDistrictLocationWriter){
        return new StepBuilder("administrativeDistrictLocationUpdateStep",jobRepository)
                .<AdministrativeDistrictAddressDTO,AddressToLocationDTO>chunk(10,transactionManager)
                .reader(administrativeDistrictAddressDTOItemReader)
                .processor(administrativeDistrictAddressProcessor)
                .writer(administrativeDistrictLocationWriter)
                .build();
    }


    @Bean
    public FlatFileItemReader<AdministrativeDistrictDTO> administrativeDistrictDTOItemReader(){
        FlatFileItemReader<AdministrativeDistrictDTO> reader = new FlatFileItemReader<>();
        reader.setResource(new ClassPathResource(DataConfig.DistrictData.getCsvFileName()));
        reader.setLinesToSkip(1);//헤더 건너뛰기

        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        tokenizer.setDelimiter(",");//구분자 설정
        tokenizer.setNames(DataConfig.DistrictData.getColumnNames());

        BeanWrapperFieldSetMapper<AdministrativeDistrictDTO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(AdministrativeDistrictDTO.class);

        DefaultLineMapper<AdministrativeDistrictDTO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);

        return reader;

    }


    @Bean
    public ItemProcessor<AdministrativeDistrictDTO,AdministrativeDistrict> administrativeDistrictProcessor(AdministrativeDistrictRepository administrativeDistrictRepository){
        return administrativeDistrictDTO -> {
            //데이터 있을 경우
            Optional<AdministrativeDistrict> existing = administrativeDistrictRepository.findByAdministrativeCode(administrativeDistrictDTO.getAdministrativeCode());

            //데이터 없는 경우
            return existing.orElseGet(() -> administrativeDistrictDTO.convertToAdministrativeDistrictEntity(administrativeDistrictDTO));

        };
    }

    @Bean
    public JpaItemWriter<AdministrativeDistrict> administrativeDistrictJpaItemWriter(EntityManagerFactory entityManagerFactory){
        JpaItemWriter<AdministrativeDistrict> writer = new JpaItemWriter<>();
        writer.setEntityManagerFactory(entityManagerFactory);
        return writer;
    }


    /*행정복지센터 주소 csv 처리 reader, processor, writer*/

    @Bean
    public FlatFileItemReader<AdministrativeDistrictAddressDTO> administrativeDistrictAddressDTOItemReader(){
        FlatFileItemReader<AdministrativeDistrictAddressDTO> reader = new FlatFileItemReader<>();

        reader.setResource(new ClassPathResource(DataConfig.DistrictAddressData.getCsvFileName()));
        reader.setLinesToSkip(1);//헤더 건너뛰기

        DelimitedLineTokenizer tokenizer = new DelimitedLineTokenizer();
        tokenizer.setDelimiter(",");
        tokenizer.setNames(DataConfig.DistrictAddressData.getColumnNames());

        BeanWrapperFieldSetMapper<AdministrativeDistrictAddressDTO> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(AdministrativeDistrictAddressDTO.class);

        DefaultLineMapper<AdministrativeDistrictAddressDTO> lineMapper = new DefaultLineMapper<>();
        lineMapper.setLineTokenizer(tokenizer);
        lineMapper.setFieldSetMapper(fieldSetMapper);

        reader.setLineMapper(lineMapper);

        return reader;
    }

    @Bean
    public ItemProcessor<AdministrativeDistrictAddressDTO, AddressToLocationDTO> administrativeDistrictAddressProcessor(AdministrativeDistrictLocationMaker administrativeDistrictLocationMaker){
        return dto -> administrativeDistrictLocationMaker.getLocation(dto.getAddress());
    }

    @Bean
    public JdbcBatchItemWriter<AddressToLocationDTO> administrativeDistrictLocationWriter(DataSource dataSource) {
        return new JdbcBatchItemWriterBuilder<AddressToLocationDTO>()
                .itemSqlParameterSourceProvider(new BeanPropertyItemSqlParameterSourceProvider<>())
                .sql("UPDATE AdministrativeDistrict SET xLongitude = :x, yLatitude = :y WHERE administrativeClassification = :admCd")
                .dataSource(dataSource)
                .build();
    }
}





