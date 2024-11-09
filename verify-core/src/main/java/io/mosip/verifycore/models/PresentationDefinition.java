package io.mosip.verifycore.models;

import io.mosip.verifycore.dto.presentation.InputDescriptorDto;
import io.mosip.verifycore.dto.presentation.SubmissionRequirementDto;
import io.mosip.verifycore.utils.LocalDateAttributeConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.net.URI;
import java.util.List;

@Table(name = "presentations")
@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor(force = true)
public class PresentationDefinition {
    @Id
    private final String id;

//    @ManyToOne
//    @JoinColumn(name = "TIME_SHEET_ID_TIME_SHEET", nullable = false)
//    @ElementCollection(targetClass = InputDescriptorDto.class, fetch = FetchType.EAGER)
    @Column(columnDefinition = "json")
    @Convert(converter = LocalDateAttributeConverter.class)
    private final List<InputDescriptorDto> inputDescriptors;

    @Column(columnDefinition = "json")
    @Transient
    private final List<SubmissionRequirementDto> submissionRequirements;


    public URI getURL(String serverURL){
        return URI.create(serverURL+"/presentation/"+this.id);
    }
}
