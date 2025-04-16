package io.inji.verify.models;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

@Table(name = "vp_submission")
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class VPSubmission {
    @Id
    @JsonProperty("state")
    @SerializedName("state")
    @Column(name = "request_id")
    String requestId;

    @JdbcTypeCode(SqlTypes.CLOB)
    @Column(name = "vp_token")
    String vpToken;

    @Column(columnDefinition = "json", name = "presentation_submission")
    @JdbcTypeCode(SqlTypes.JSON)
    PresentationSubmissionDto presentationSubmission;
}