package com.kodong.underscore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UnderscoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(UnderscoreApplication.class, args);
	}

}
