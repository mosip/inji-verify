package io.inji.verify.verifyservice.models;

import io.inji.verify.verifyservice.dto.submission.PresentationSubmissionDto;
import io.inji.verify.verifyservice.enums.SubmissionStatus;
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

@Table(name = "VPSubmissions")
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class VPSubmission {
    @Id
    String state;

    @JdbcTypeCode(SqlTypes.CLOB)
    String vpToken;

    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    PresentationSubmissionDto presentationSubmission;

    SubmissionStatus submissionStatus;
}
