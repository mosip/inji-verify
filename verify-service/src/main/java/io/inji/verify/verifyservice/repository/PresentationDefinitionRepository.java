package io.inji.verify.verifyservice.repository;

import io.inji.verify.verifyservice.models.PresentationDefinition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PresentationDefinitionRepository extends JpaRepository<PresentationDefinition, String> { }
