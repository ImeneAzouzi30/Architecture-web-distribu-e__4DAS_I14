package com.awd.monolith;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * AWD recruitment platform - monolithic version.
 * <p>
 * One application, one database, three business modules (packages):
 * candidat, job and candidature. Each package will become a microservice.
 */
@EnableDiscoveryClient
@SpringBootApplication
public class JobApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobApplication.class, args);
    }
}
