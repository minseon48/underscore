package com.kodong.underscore.map.controller;

import com.kodong.underscore.map.data.SGIS.AdministrativeDistrictLocationMaker;
import com.kodong.underscore.map.repository.AdministrativeDistrictRepository;
import com.kodong.underscore.map.service.ScoreApiService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class BatchJobController {
    private final JobLauncher jobLauncher;
    private final Job processDataInsertJob;
    private final Job administrativeLocationPutJob;
    private final Job businessAttractionInitJob;
    private final Job businessAttractionUpdateJob;
    private final ScoreApiService scoreApiService;
    private final AdministrativeDistrictLocationMaker administrativeDistrictLocationMaker;
    private final AdministrativeDistrictRepository administrativeDistrictRepository;

    public BatchJobController(JobLauncher jobLauncher,
                              @Qualifier("processDataInsertJob") Job processDataInsertJob,
                              @Qualifier("administrativeLocationPutJob") Job administrativeLocationPutJob,
                              @Qualifier("businessAttractionInitJob") Job businessAttractionInitJob,
                              @Qualifier("businessAttractionUpdateJob") Job businessAttractionUpdateJob,
                              ScoreApiService scoreApiService,
                              AdministrativeDistrictLocationMaker administrativeDistrictLocationMaker,
                              AdministrativeDistrictRepository administrativeDistrictRepository){

        this.jobLauncher = jobLauncher;
        this.processDataInsertJob = processDataInsertJob;
        this.administrativeLocationPutJob = administrativeLocationPutJob;
        this.businessAttractionInitJob = businessAttractionInitJob;
        this.businessAttractionUpdateJob = businessAttractionUpdateJob;
        this.scoreApiService =scoreApiService;
        this.administrativeDistrictLocationMaker = administrativeDistrictLocationMaker;
        this.administrativeDistrictRepository = administrativeDistrictRepository;
    }

    @GetMapping("/run-batch-job")
    public String runBatchJob() throws Exception{
        JobParameters jobParameters = new JobParametersBuilder()
                .addLong("time",System.currentTimeMillis())
                .toJobParameters();

        administrativeDistrictLocationMaker.refreshSGISAccessToken();
        log.info("processDataInsertJob started");

        jobLauncher.run(processDataInsertJob,jobParameters);

        return "Batch job has been invoked";
    }
}
