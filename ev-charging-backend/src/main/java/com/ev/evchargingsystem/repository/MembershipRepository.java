package com.ev.evchargingsystem.repository;

import com.ev.evchargingsystem.entity.Membership;
import com.ev.evchargingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface MembershipRepository extends JpaRepository<Membership, Integer> {
    void deleteByUser(User user);
}
