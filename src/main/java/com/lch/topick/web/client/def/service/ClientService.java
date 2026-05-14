package com.lch.topick.web.client.def.service;

import java.util.List;

import com.lch.topick.web.client.def.domain.ClientRequestDTO;
import com.lch.topick.web.client.def.entity.Client;

public interface ClientService {
	
	/* SELECT 고객 리스트 */
	public List<Client> selectList();
	
	/* SELECT 고객 상세 */
	public Client selectOne(String clientId);
	
	/* INSERT 새 계정 생성 */
	public Client insert(ClientRequestDTO dto);

	/* UPDATE 기존 계정 수정 */
	public Client update(String clientId, ClientRequestDTO dto);
	
	/* resign 회원탈퇴 */
	public void delete(String clientId);

}//interface
