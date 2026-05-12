package com.lch.topick.web.menuList.def.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.lch.topick.web.menuList.def.entity.Menu;
import com.lch.topick.web.menuList.def.repository.MenuRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {
	private MenuRepository repository;
	
	@Override
	public List<Menu> selectList(Long storeNo) {
		return repository.findByStoreNo(storeNo); 
	}
	
	@Override
	public List<Menu> selectOptionList(Long menuNo) {
		return repository.findByStoreNo(menuNo);
	}
	
}//class
