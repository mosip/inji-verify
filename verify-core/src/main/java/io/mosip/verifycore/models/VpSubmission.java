package io.mosip.verifycore.models;

import io.mosip.verifycore.dto.submission.PresentationSubmissionDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Table(name = "VpSubmissions")
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class VpSubmission {
    @Id
    String state;

    @JdbcTypeCode(SqlTypes.CLOB)
    String vpToken;

    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    PresentationSubmissionDto presentationSubmission;
}
