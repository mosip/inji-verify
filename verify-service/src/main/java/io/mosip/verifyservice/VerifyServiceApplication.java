package io.mosip.verifyservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan("io.mosip.verifycore")
public class VerifyServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(VerifyServiceApplication.class, args);
    }

}
