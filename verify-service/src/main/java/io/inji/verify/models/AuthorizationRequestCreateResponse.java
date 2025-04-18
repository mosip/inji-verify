package io.inji.verify.models;

import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.io.Serializable;

@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Table(name = "authorization_request_details")
public class AuthorizationRequestCreateResponse implements Serializable {
    @Id
    @Column(name="request_id")
    private final String requestId;

    @NotNull
    @Column(name="transaction_id")
    private final String transactionId;

    @NotNull
    @Column(columnDefinition = "json", name="authorization_details")
    @JdbcTypeCode(SqlTypes.JSON)
    AuthorizationRequestResponseDto authorizationDetails;

    @NotNull
    @Column(name="expires_at")
    long expiresAt;
}