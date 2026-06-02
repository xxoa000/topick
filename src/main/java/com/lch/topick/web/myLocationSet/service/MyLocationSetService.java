package com.lch.topick.web.myLocationSet.service;

import java.util.List;
import java.util.Map;

import com.lch.topick.web.myLocationSet.entity.MyLocationSet;

public interface MyLocationSetService {
	//** selectList
	List<MyLocationSet> selectList();

	//** selectOne
	MyLocationSet selectOne(long addressNo);

	//** insert & update
	MyLocationSet save(MyLocationSet entity);

	//** delete
	void deleteById(long id) throws Exception;
	
	List<MyLocationSet> findByMemberId(String memberId);

	MyLocationSet findByMemberIdAndAddressDefault(String memberId, char addressDefault);
	
	Map<String, String> changeDefaultAddress(long addressNo);
}
