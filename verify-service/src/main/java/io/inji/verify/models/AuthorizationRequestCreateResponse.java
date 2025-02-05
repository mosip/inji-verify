package io.inji.verify.models;

import java.io.Serializable;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import io.inji.verify.dto.authorizationrequest.AuthorizationRequestResponseDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor(force = true)
@Table(name = "authorization_request_details")
public class AuthorizationRequestCreateResponse implements Serializable {
    @Id
    private final String requestId;

    @NotNull
    @Column
    private final String transactionId;

    @NotNull
    @Column(columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    AuthorizationRequestResponseDto authorizationDetails;

    @NotNull
    @Column
    long expiresAt;
}