package com.lch.topick.web.myLocationSet.service;

import java.util.List;
import java.util.Map;

import com.lch.topick.web.myLocationSet.entity.MyLocationSet;

public interface MyLocationSetService {
	//** selectList
	List<MyLocationSet> selectList();

	//** selectOne
	MyLocationSet selectOne(int addressNo);

	//** insert & update
	MyLocationSet save(MyLocationSet entity);

	//** delete
	void deleteById(int id) throws Exception;
	
	public List<MyLocationSet> findByMemberId(String memberId);
}
