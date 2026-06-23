package com.lch.topick.web.myLocationSet.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.myLocationSet.domain.MyLocationSetDTO;
import com.lch.topick.web.myLocationSet.entity.MyLocationSet;
import com.lch.topick.web.myLocationSet.service.MyLocationSetService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/myLocationSet")
@RequiredArgsConstructor	
@Log4j2
public class MyLocationSetController {

	private final MyLocationSetService myLocationSetService;
	
	@PostMapping("/join")
    public ResponseEntity<?> join(@AuthenticationPrincipal String memberId, @RequestBody MyLocationSetDTO dto) 
                                            throws IOException {
        try {
            //  USER Role 추가후
            //=> save 전에 USER Role 추가
            //=> 추후, 조건에 따라 Role 추가하면됨
            //entity.addRole(MemberRole.USER); 
            //=> save
        	char addressDefault = 'N';
        	if(myLocationSetService.findByMemberId(memberId).size() <=0) addressDefault = 'Y';
        	
        	MyLocationSet entity = MyLocationSet.builder()
            .memberId(memberId)
            .addressPostcode(dto.getAddressPostcode())
            .addressRoad(dto.getAddressRoad())
            .addressLot(dto.getAddressLot())
            .addressDetail(dto.getAddressDetail())
            .addressName(dto.getAddressName())
            .addressX(dto.getAddressX())
            .addressY(dto.getAddressY())
            .addressDefault(addressDefault)
            .build();
        	
            log.info(" MyLocationSet Insert 성공 => "+ myLocationSetService.save(entity));
            return ResponseEntity.ok("등록 성공");
        } catch (Exception e) {
            log.error("** 등록 실패 => "+ e.toString());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("등록실패: "+e.toString());
        }
    } //join
	
	@GetMapping("/addresslist")
	public ResponseEntity<?> addressList(
			@AuthenticationPrincipal String memberId
			) {
	    List<MyLocationSet> list = myLocationSetService.findByMemberId(memberId);
	    if(list!=null) {
			return ResponseEntity.ok(list);
		} else return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
									.body("출력 오류");
	    
	}//selecte
	
	@PatchMapping("/default/{addressNo}")
	public ResponseEntity<?> changeAddressDefault(@PathVariable("addressNo") long addressNo) {
		try {
			// 서비스에 비즈니스 로직 위임
//			myLocationSetService.changeDefaultAddress(addressNo);
			
			log.info(" MyLocationSet 기본 위치 변경 성공 => addressNo: " + addressNo);
			return ResponseEntity.ok(myLocationSetService.changeDefaultAddress(addressNo));
		} catch (Exception e) {
			log.error("** 기본 위치 변경 실패 => " + e.toString());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
										.body("변경 실패: " + e.getMessage());
		}
	}//changeAddressDefault
	
	@DeleteMapping("/delete/{addressNo}")
    public ResponseEntity<?> deleteReview(
            @PathVariable("addressNo") Long addressNo) {
        
        String result = myLocationSetService.deleteById(addressNo);
        
        if (result.startsWith("NOT_FOUND")) {
            return ResponseEntity.status(404).body("존재하지 않거나 이미 삭제된 리뷰입니다.");
        }
        
        return ResponseEntity.ok("저장된 위치가 삭제되었습니다.");
    }
	
}
