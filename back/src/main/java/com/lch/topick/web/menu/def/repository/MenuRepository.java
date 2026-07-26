package com.lch.topick.web.menu.def.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lch.topick.web.menu.def.entity.Menu;

public interface MenuRepository extends JpaRepository<Menu,Long> {

	public List<Menu> findByStoreNo(Long storeNo);
	
	public List<Menu> findByMenuNo(Long menuNo);
	
	Optional<Menu> findByStoreNoAndMenuName(Long storeNo, String menuName);
}//interface
