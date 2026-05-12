package com.lch.topick.web.menuList.def.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.lch.topick.web.menuList.def.entity.Menu;

public interface MenuRepository extends JpaRepository<Menu,Long> {

	public List<Menu> findByStoreNo(Long storeNo);
	
	public List<Menu> findByMenuNo(Long menuNo);
	
	public List<Menu> findAll();
	
	
}//interface
