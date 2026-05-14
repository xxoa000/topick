package com.lch.topick.web.client.def.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.lch.topick.web.client.def.entity.Client;

public interface ClientRepository extends JpaRepository<Client, String> {
	
	/* findAll() , findById() , save() 등은 기본으로 제공됨 */

}//interface
