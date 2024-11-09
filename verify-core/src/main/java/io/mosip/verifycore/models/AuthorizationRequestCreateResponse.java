package io.mosip.verifycore.models;

import io.mosip.verifycore.dto.authorizationRequest.AuthorizationRequestDto;
import io.mosip.verifycore.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @Embedded
    @Column(columnDefinition = "json")
    AuthorizationRequestDto authorizationDetails;

    @NotNull
    @Column
    String expiresAt;

    @NotNull
    Status status = Status.PENDING;
}