package io.inji.verify;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties =
        {
                "inji.vp-request.long-polling-timeout = 1000",
                "spring.datasource.url = jdbc:h2:mem:verifydb",
                "spring.datasource.driverClassName = org.h2.Driver",
                "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
                "spring.jpa.hibernate.ddl-auto = create"
        })
class VerifyServiceApplicationTests {

    @Test
    void contextLoads() {
    }

}
