package com.lch.topick.web.myLocationSet.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.lch.topick.web.myLocationSet.entity.MyLocationSet;
import com.lch.topick.web.myLocationSet.repository.KakaoAddressRepository;
import com.lch.topick.web.myLocationSet.repository.MyLocationSetRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MyLocationSetServiceImpl implements MyLocationSetService{

	private final MyLocationSetRepository myLocationSetRepository;
	
	// 외부 API 통신용 레포지토리를 상수로 선언
    private final KakaoAddressRepository kakaoAddressRepository;
    
	@Override
	public List<MyLocationSet> selectList() {
		return myLocationSetRepository.findAll();
	}//selectList
	
	@Override
	public MyLocationSet selectOne(int addressNo) {
		Optional<MyLocationSet> result = myLocationSetRepository.findById(addressNo);
		if(result.isPresent()) return result.get();
		else return null;
	}//selectOne
	
	@Override
	public MyLocationSet save(MyLocationSet entity) {
		return myLocationSetRepository.save(entity);
	}//save
	
	@Override
	public void deleteById(int id) throws Exception {
		if(!myLocationSetRepository.existsById(id)) {
			throw new Exception("Member Delete_Data Not Found, id=" + id);
		} else {
			myLocationSetRepository.deleteById(id);
		}
	}//deleteById

    @Override
    public Map<String, String> findCoordinateByAddress(String roadAddress) {
        // 비즈니스 로직 수행: 레포지토리에 주소 변환 요청 후 결과 그대로 반환
        return kakaoAddressRepository.findCoordinateByAddress(roadAddress);
    }
	
}
