package com.lch.topick.web.client.def.service;

import java.util.List;

import com.lch.topick.web.client.def.domain.ClientRequestDTO;
import com.lch.topick.web.client.def.entity.Client;

public interface ClientService {
	
	/* SELECT 고객 리스트 */
	public List<Client> selectList();
	
	/* SELECT 고객 상세 */
	public Client selectOne(String clientId);
	
	/* join || 내 정보 수정 */
	public Client save(String clientId, ClientRequestDTO requestDto);
	
	/* resign 회원탈퇴 */
	public void delete(String clientId);

}//interface
