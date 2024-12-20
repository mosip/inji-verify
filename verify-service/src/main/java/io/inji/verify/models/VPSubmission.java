package io.inji.verify.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nimbusds.jose.shaded.gson.annotations.SerializedName;
import io.inji.verify.dto.submission.PresentationSubmissionDto;
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

@Table(name = "VPSubmission")
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class VPSubmission {
    @Id
    @JsonProperty("state")
    @SerializedName("state")
    String requestId;

    @JdbcTypeCode(SqlTypes.CLOB)
    String vpToken;

    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    PresentationSubmissionDto presentationSubmission;
}
