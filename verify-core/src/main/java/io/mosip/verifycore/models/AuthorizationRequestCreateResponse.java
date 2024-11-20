package io.mosip.verifycore.models;

import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestDto;
import io.mosip.verifycore.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "AuthorizationRequestResponses")
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class AuthorizationRequestCreateResponse implements Serializable {
    @Id
    private final String requestId;

    @NotNull
    @Column
    private final String transactionId;

    @NotNull
    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    AuthorizationRequestDto authorizationDetails;

    @NotNull
    @Column
    long expiresAt;

    @NotNull
    Status status = Status.PENDING;
}