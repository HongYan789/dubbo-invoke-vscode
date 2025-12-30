package com.jzt.zhcai.user.companyinfo;


import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.jzt.wotu.base.ResponseResult;
import com.jzt.wotu.rpc.dubbo.dto.MultiResponse;
import com.jzt.wotu.rpc.dubbo.dto.PageResponse;
import com.jzt.wotu.rpc.dubbo.dto.SingleResponse;
import com.jzt.zhcai.user.b2bbusinessscope.co.UserB2bBusinessScopeCO;
import com.jzt.zhcai.user.branchcompany.dto.BranchCompanyDTO;
import com.jzt.zhcai.user.branchcompany.dto.BranchCompanyDetailDTO;
import com.jzt.zhcai.user.branchcompany.dto.CompanyDetailInfoDTO;
import com.jzt.zhcai.user.branchcompany.dto.SelectCompanyInfoDTO;
import com.jzt.zhcai.user.branchcompany.qo.BranchCompanyQO;
import com.jzt.zhcai.user.branchcompany.qo.SaveOrUpdateBranchCompanyInfoRequest;
import com.jzt.zhcai.user.branchcompany.qo.SelectCompanyQO;
import com.jzt.zhcai.user.companyinfo.co.CompanyAggregationCO;
import com.jzt.zhcai.user.companyinfo.co.ScrollPageResponse;
import com.jzt.zhcai.user.companyinfo.co.UserCompanyInfo4Kf;
import com.jzt.zhcai.user.companyinfo.co.UserCompanyInfo4UpdateCO;
import com.jzt.zhcai.user.companyinfo.co.UserCompanyInfoCO;
import com.jzt.zhcai.user.companyinfo.co.UserCompanyInfoForCustomerServiceCO;
import com.jzt.zhcai.user.companyinfo.co.UserCompanyInfoForUpdateCO;
import com.jzt.zhcai.user.companyinfo.co.UserCompanyInfoPinAnCO;
import com.jzt.zhcai.user.companyinfo.co.UserCompanyLicenseManagerEsCO;
import com.jzt.zhcai.user.companyinfo.co.UserMainCompanyInfo4Kf;
import com.jzt.zhcai.user.companyinfo.co.UserStoreBatchImportResultDataCO;
import com.jzt.zhcai.user.companyinfo.co.UserStoreCheckNewResultCO;
import com.jzt.zhcai.user.companyinfo.co.UserValidCompanyInfoCO;
import com.jzt.zhcai.user.companyinfo.co.UserCompanyAddressInfoCO;
import com.jzt.zhcai.user.companyinfo.dto.ClusterInfoQuery;
import com.jzt.zhcai.user.companyinfo.dto.CompanyInfoQry;
import com.jzt.zhcai.user.companyinfo.dto.CompanyInfoQuery;
import com.jzt.zhcai.user.companyinfo.dto.CompanyInfoScrollQuery;
import com.jzt.zhcai.user.companyinfo.dto.CompanyProvinceDTO;
import com.jzt.zhcai.user.companyinfo.dto.CompanyQuery;
import com.jzt.zhcai.user.companyinfo.dto.GenerateBranchCompanyNumberQry;
import com.jzt.zhcai.user.companyinfo.dto.StoreCompanyInfoQuery;
import com.jzt.zhcai.user.companyinfo.dto.StoreCompanyInfoScrollQuery;
import com.jzt.zhcai.user.companyinfo.dto.TimeOutNotUpdateQuery;
import com.jzt.zhcai.user.companyinfo.dto.UserCompanyAttributeDTO;
import com.jzt.zhcai.user.companyinfo.dto.UserCompanyDZSYUpdQry;
import com.jzt.zhcai.user.companyinfo.dto.UserCompanyLicenseStatusCO;
import com.jzt.zhcai.user.companyinfo.dto.request.*;
import com.jzt.zhcai.user.companyinfo.dto.response.*;
import com.jzt.zhcai.user.contract.dto.LegalPersonConfirmQuery;
import com.jzt.zhcai.user.contract.model.LegalPersonConfirmDetailModel;
import com.jzt.zhcai.user.dzsy.DzsyCO;
import com.jzt.zhcai.user.erp.vo.B2BDownstreamDTO;
import com.jzt.zhcai.user.event.SendCompanyInfoToPingAnEvent;
import com.jzt.zhcai.user.othercenter.trade.dto.request.GetCompanyDataRequest;
import com.jzt.zhcai.user.othercenter.trade.dto.response.GetCompanyDataResponse;
import com.jzt.zhcai.user.storecompany.co.UserBasicCompanyCO;
import com.jzt.zhcai.user.userCompanyBrandCust.dto.request.UserCompanyBrandCustAllReqDTO;
import com.jzt.zhcai.user.userCompanyBrandCust.dto.response.UserCompanyBrandCustResDTO;
import com.jzt.zhcai.user.userLicense.co.UserLicenseTypeCO;
import com.jzt.zhcai.user.userLicense.co.UserLicenseValificationResultCO;
import com.jzt.zhcai.user.userb2b.co.QueryCreditDetailCO;
import com.jzt.zhcai.user.userb2b.co.UserB2bQualificationListCO;
import com.jzt.zhcai.user.userb2b.dto.*;
import com.jzt.zhcai.user.userbasic.co.UserBasicInfoCO;
import com.jzt.zhcai.user.userbasic.dto.B2bMembersPage;
import com.jzt.zhcai.user.userbasic.dto.B2bSubAccountQry;
import com.jzt.zhcai.user.userbasic.dto.CompanyInfoDetailQry;
import io.swagger.annotations.ApiOperation;

import java.util.List;
import java.util.Map;

/**
 * B2B-企业信息接口
 */
public interface CompanyInfoDubboApi {
    /*
     *查询出的客户信息列表
     * */
    List<UserCompanyInfoCO> getCompanyInfoByCompanyIdsAndDanwBh(List<Long> companyIdList, List<String> danwBhList, Long storeId);

    void dzsyTrusteeInfoChangeNotifyKf(List<Long> companyIdList);

    ResponseResult<List<UserValidCompanyInfoCO>> queryExsitCompanyListPage(List<Long> companyIds);

    /**
     * 批量获取CA状态
     * @param companyIds
     * @return
     */
    List<UserCompanyInfoCO> getUserCompanyCAStateByCompanyIds(List<Long> companyIds);

    UserCompanyInfoCO getUserCompanyCAStateByCompanyId(Long companyId);


    /**
     * @param query
     * @return com.baomidou.mybatisplus.extension.plugins.pagination.Page<com.jzt.zhcai.user.companyinfo.co.UserCompanyInfoCO>
     * @author lumanman
     * @date 2022/7/5 12:00
     * @description: 分页查询客户列表
     */
    PageResponse<UserCompanyInfoCO> queryCompanyInfoListPage(ClusterInfoQuery query);

    /**
     * 导出核验明细*
     *
     * @param query
     * @return
     */
    PageResponse<UserLicenseValificationResultCO> queryCompanyLicenseValifiResultList(ClusterInfoQuery query);

    /**
     * @param companyInfoDetailQry
     * @return java.lang.Object
     * @author lumanman
     * @date 2022/7/8 9:15
     * @description: 查询会员详细信息
     */
    Object queryCompanyInfoDetail(CompanyInfoDetailQry companyInfoDetailQry);

    /**
     * 滚动查询企业的主账号+子账号列表,滚动展示
     * @param qry
     * @return
     */
    B2bMembersPage queryMainAndSubAccountScroll(B2bSubAccountQry qry);

    /**
     * @param licenseChangeRecordQry
     * @return com.jzt.wotu.rpc.dubbo.dto.PageResponse<com.jzt.zhcai.user.userb2b.co.UserB2bQualificationListCO>
     * @author lumanman
     * @date 2022/7/12 16:32
     * @description: 分页查询证照变更记录
     */
    PageResponse<UserB2bQualificationListCO> queryLicenseChangeRecordPage(LicenseChangeRecordQry licenseChangeRecordQry);

    /**
     * 新增编辑企业信息接口
     */
    ResponseResult addOrEditCompanyInfo(CompanyInfoQry companyInfoApiDTO);

    /**
     * B2B删除企业信息接口
     */
    ResponseResult deleteCompanyInfoById(Long companyInfoId);

    /**
     * 根据企业名称查询
     *
     * @param companyName
     * @return
     */
    List<UserCompanyInfoCO> selectByCompanyName(String companyName);

    /**
     * 根据companyId查询企业信息
     *
     * @param companyId
     * @return
     */
    UserCompanyInfo4UpdateCO queryCompanyInfoByCompanyIdAndStoreId(Long companyId, Long storeId);

    /**
     * 提供给客服的查客户基本信息和状态信息
     * @param request
     * @return
     */
    ResponseResult<StoreCompanyInfo4CsResponse> getCompanyStoreBaseInfoAndLastQualification(CompanyInfoCsRequest request);

    /**
     * 提供给客服的查客户基本信息和状态信息,客服药九九场景
     * @param userPhone
     * @return
     */
    SingleResponse<StoreCompanyInfo4CsResponse> getCompanyStoreBaseInfoAndLastQualificationOfYjj(String userPhone);

    /**
     * 根据companyId查询企业信息
     *
     * @param companyId
     * @return
     */
    UserCompanyInfo4UpdateCO queryCompanyInfoByCompanyId(Long companyId);


    /**
     * 平安对接-根据companyId查询企业信息
     *
     * @param companyId
     * @return
     */
    UserCompanyInfoPinAnCO queryCompanyInfoPinAnByCompanyId(Long companyId);

    /**
     * 根据userId查询企业信息
     *
     * @param userId
     * @return
     */
    UserCompanyInfoCO queryCompanyInfoByUserId(Long userId);

    /**
     * 根据companyId查询企业信息
     *
     * @param companyId
     * @return
     */
    UserCompanyInfoCO getCompanyInfoByCompanyId(Long companyId);

    MultiResponse<CompanyProvinceDTO> getCompanyProvinceCodes(CompanyProvinceRequest request);
    /**
     * 从数据库查企业基础信息，不含发票信息
     */
    SingleResponse<UserCompanyInfoCO> getCompanyInfoFromDb(UserCompanyInfoDetailReq req);

    SingleResponse<UserMainCompanyInfo4Kf> getMainCompanyInfo4Kf(Long companyId);

    MultiResponse<UserCompanyInfo4Kf> batchGetCompanyInfoList4Kf(CompanyInfoBatchQry4Kf qry);

    /**
     * 根据companyId查询企业信息
     * @param companyId
     * @param containBusinessScopeMapping 是否包含经营简码映射
     * @return
     */
    UserCompanyInfoCO getCompanyInfoByCompanyId(Long companyId,Boolean containBusinessScopeMapping);

    /**
     * 根据companyIds批量查询企业信息
     */
    List<UserCompanyInfoCO> getCompanyInfoByCompanyIds(List<Long> companyIds);


    /**
     * 根据会员标签/ 会员类型/ 区域 查询指定的会员列表
     * 入参: 会员标签ids, 会员类型ids, 区域编码
     * 出参: 会员ID,名称,地区,类型
     */
    PageResponse<UserCompanyInfoCO> getCompanyInfoPageOld(CompanyInfoQuery query);

    PageResponse<UserCompanyInfoCO> getCompanyInfoPage(CompanyInfoQuery query);

    MultiResponse<UserCompanyInfoCO> getCompanyInfoNotJcList(CompanyNotJcStoreReq req);

    PageResponse<UserCompanyInfoCO> getCompanyInfoEsPage(CompanyInfoPageEsRequest companyInfoPageEsRequest);

    MultiResponse<UserCompanyInfoCO> getCompanyInfoEsList(CompanyInfoQuery query);

    SingleResponse<Long> getCompanyInfoEsCount(CompanyInfoQuery query);

    ScrollPageResponse<Map<String, Object>> getCompanyInfoPageWithScroll(CompanyInfoScrollQuery query);

    SingleResponse<Long> getCompanyInfoPageEsSearch(CompanyInfoQuery query);

    ScrollPageResponse<Map<String, Object>> getStoreCompanyInfoPageWithScroll(StoreCompanyInfoScrollQuery query);

    /**
     * 根据 店铺ID/ 会员标签/ 会员类型/ 区域 查询指定的会员列表
     * 入参: 店铺ID，会员标签ids, 会员类型ids, 区域编码
     * 出参: 会员ID,名称,地区,类型,店铺内码,店铺编码
     */
    PageResponse<UserCompanyInfoCO> getStoreCompanyInfoPageOld(StoreCompanyInfoQuery query);

    PageResponse<UserCompanyInfoCO> getStoreCompanyInfoPage(StoreCompanyInfoQuery query);

    /**
     * 根据企业ID获取经营范围
     * 备注：经营范围已迁移至公共服，无法提供查询
     */
    List<UserB2bBusinessScopeCO> getBusinessScope(Long companyId);

    SingleResponse<UserCompanyInfoCO> getCompanyInfo(Long companyId);

    /**
     * 通过企业ID集合获取企业主账号信息
     */
    MultiResponse<UserBasicCompanyCO> getUserBasicInfoByQuery(CompanyInfoQuery query);

    /**
     * 注册审核成功后未登录?天的用户
     */
    MultiResponse<UserBasicCompanyCO> getUserBasicInfoByRegisterDays(Integer days);

    /**
     * 会员资质分页列表
     */
    Page<UserCompanyLicenseStatusCO> getCompanyAndLicensePage(UserCompanyLicenseStatusQry query);

    /**
     * 通过关键字查询企业信息
     */
    PageResponse<UserCompanyInfoCO> getCompanyInfoByQuery(CompanyQuery query);

    /**
     * 查询电子首营状态为待审核的电子首营企业ID集合
     */
    MultiResponse<Long> getTenantIdsByDzsyWaitCheck();

    /**
     * 批量更新电子首营账号状态
     */
    SingleResponse batchUpdateDzsyState(List<Long> tenantIds, Integer dzsyState);

    SingleResponse<UserCompanyInfoCO> selectByTenantId(Long tenantId);

    SingleResponse<Boolean> updateDZSYInfo(UserCompanyDZSYUpdQry qo);

    SingleResponse<Boolean> updateDZSYInfoNotCheck(UserCompanyDZSYUpdQry qo);

    SingleResponse<Boolean> updateDzsyInfoByApproveRegister(UserCompanyDZSYUpdQry qo);

    SingleResponse<Boolean> updateUserCompanyInfo(UserCompanyDZSYUpdQry qo);

    /**
     * 企业平台级信息修改保存
     *
     * @param qry
     * @return
     */
    ResponseResult saveUserPlatformData(UserCompanyPlatformQry qry);

    ResponseResult updUserCompanyInfo(UpdUserInfoRequest request);

    /**
     * 根据companyId更新建采表经营范围到企业表
     *
     * @param
     * @return
     */
    ResponseResult updateBusinessScope(Long companyId, String provinceCode, Long beginIndex, Long endIndex);


    MultiResponse<UserBasicInfoCO> queryAccountInfoByCompanyName(String companyName);

    /**
     * 根据companyId查询企业信息
     *
     * @param companyId
     * @return
     */
    UserCompanyInfo4UpdateCO queryCompanyByCompanyId(Long companyId);



    ResponseResult<List<UserCompanyInfoCO>> selectByBussnessLicenseNumber(String bussnessLicenseNumber);

    /**
     * 获取法人信息
     *
     * @param companyId
     * @return
     */
    SingleResponse<LegalPersonConfirmDetailModel> getLegalPersonConfirmDetail(Long companyId);

    /**
     * 更新法人信息
     *
     * @param query
     * @return
     */
    ResponseResult<Boolean> updLegalPersonInfoByCompanyId(LegalPersonConfirmQuery query);


    ResponseResult<DzsyCO> getCaStatus(String businessLicenseNumber);

    Integer updateByCompanyId(UserCompanyInfoCO co);

    Integer updateDzsyByCompanyId(UserCompanyInfoCO co);


    B2BDownstreamDTO queryERPBean(Long companyId, Long storeId, List<UserLicenseTypeCO> userLicenseTypeCOs);

    PageResponse<UserCompanyBrandCustResDTO> getAllBrandCustList(UserCompanyBrandCustAllReqDTO query);


    SingleResponse<String> getQPhone(Long companyId);

    Page<UserCompanyInfoResponse> selectJCCompanyInfoPage(JSONObject request);

    /**
     * 社会信用编码
     *
     * @param creditCode
     * @return
     */
    List<UserCompanyInfoCO> selectByCreditCode(String creditCode);

    /**
     * https://confluence-b2b.yyjzt.com/pages/viewpage.action?pageId=110371834
     * 根据企业Id，会员id 提供用户属性埋点信息
     *
     * @param companyId
     * @param userBasicId
     * @return
     */
    SingleResponse<UserCompanyAttributeDTO> getCompanyAttributeBurialPoint(Long companyId, Long userBasicId);

    PageResponse<UserCompanyInfoResponse> getCompanyByFullyFuzzySearchPage(CompanyInfoPageRequest request);

    /**
     * 查询当前企业信息中企业名称和企业社会信用编码待前后空格的数据
     *
     * @param companyIds
     * @return
     */
    ResponseResult<List<UserCompanyInfoCO>> findRequireRepairCompanyInfo(String companyIds);

    /**
     * 企业信息变更，发送消息到支付中心
     *
     * @param sendCompanyInfoToPingAnEvent
     */
    void createSendMq2PingAnMsg(SendCompanyInfoToPingAnEvent sendCompanyInfoToPingAnEvent);


    /**
     * 根据企业id集合查询企业id列表
     *
     * @param companyIdList
     * @return
     */
    List<Long> getCompanyIdList(List<Long> companyIdList);

    /**
     * 根据企业名称集合查询企业信息列表
     *
     * @param companyNameList
     * @return
     */
    List<UserCompanyInfoCO> getCompanyListByNames(List<String> companyNameList);


    /**
     * 企业聚合信息接口查询
     *
     * @param request
     * @return
     */
    CompanyAggregationCO selectCompanyAggregation(CompanyAggregationRequest request);

    @ApiOperation("获取企业相关信息-聚合接口")
    UserCompanyAggResponse getCompanyInfoAgg(UserCompanyAggRequest request);

    /**
     * 分页查询分室列表信息
     *
     * @param branchCompanyQO
     * @return
     */
    PageResponse<BranchCompanyDTO> getBranchCompanyList(BranchCompanyQO branchCompanyQO);

    /**
     * 根据建采主键id查询分室详情信息
     *
     * @param storeCompanyId
     * @return
     */
    SingleResponse<BranchCompanyDetailDTO> findBranchCompanyDetailByStoreCompanyId(Long storeCompanyId);


    PageResponse<SelectCompanyInfoDTO> selectCanCreateBranchCompanyList(SelectCompanyQO qo);

    ResponseResult<CompanyDetailInfoDTO> loadCompanyInfoByCompanyId(Long companyId);

    /**
     * 生成分室编码，同一个医疗机构执业许可证号从001开始依次递增自动生成
     *
     * @param qry 请求参数
     * @return 返回分室编码
     */
    SingleResponse<String> generateBranchCompanyNumber(GenerateBranchCompanyNumberQry qry);


    ResponseResult<UserCompanyInfoCO> saveBranchCompanyRegister(SaveOrUpdateBranchCompanyInfoRequest request) throws Exception;


    /**
     * 更新分室企业，建采信息
     *
     * @param request
     * @return
     */
    ResponseResult<UserCompanyInfoCO> updateBranchCompanyInfo(SaveOrUpdateBranchCompanyInfoRequest request) throws Exception;

    SingleResponse<Boolean> updateUserCompanyInfoByCaRzMq(UserCompanyDZSYUpdQry qo);

    SingleResponse<UserCompanyInfoCO> userCompanyInfoRepeatCheck(GenerateBranchCompanyNumberQry qry);

    SingleResponse<String> createBranchNumberByCreditCode(GenerateBranchCompanyNumberQry qry);

    /**
     * 查询企业经纬度信息
     */
    ResponseResult<CompanyLngAndLatResponse> getCompanyLngAndLatInfo(CompanyLngAndLatRequest companyLngAndLatRequest);

    SingleResponse updateUserCompanyInfoByUpdQry(UserCompanyUpdateQry userCompanyUpdateQry) throws Exception;
    
    public void initUserCompanyInfoAgg(UserCompanyInfoInitAggRequest userCompanyInfoInitAggRequest);
    
    public Boolean initUserCompanyInfoAggEnd();

    Boolean initUserCompanyInfoAggAllKey();

    /**
     * 分页查询企业id
     *
     * @param companyInfoIdPageRequest
     * @return
     */
    PageResponse<Long> selectCompanyInfoIdIdByPage(CompanyInfoIdPageRequest companyInfoIdPageRequest);

	

    @ApiOperation("诊所业务-分页查询企业id")
    PageResponse<Long> selectCompanyIdClinicPage(GetCompanyIdPageClinicRequest request);

    @ApiOperation("诊所业务-批量查询企业详情")
    MultiResponse<GetCompanyDetailClinicResponse> selectCompanyDetailClinicBatch(GetCompanyDetailClinicRequest request);

    PageResponse<UserCompanyInfoCO> queryCompanyInfoListPageForTimeOutNotUpdate(TimeOutNotUpdateQuery query);
    /**
     * 通过企业id获取企业账号信息
     */
    MultiResponse<B2BSubAccountResponse> getB2bAccountByCompanyId(Long companyId);
    MultiResponse<B2BSubAccountResponse> getB2bAccountByCompanyIdV2(Long companyId);

    /**
     * 客户资料修改查询客户详情
     *
     * @param companyId 客户编码
     * @return 客户信息
     */
    SingleResponse<UserCompanyInfoForUpdateCO> queryUserCompanyInfoDetailForUpdate(Long companyId);

    /**
     * 校验批量建采
     * @param importData
     * @return
     */
    SingleResponse<UserStoreCheckNewResultCO> check(UserStoreBatchImportResultDataCO importData);

    /**
     * 初始化客户证照管理es
     * @param req
     * @return
     */
    ResponseResult initUserCompanyLicenseManager(UserCompanyLicenseManagerInitRequest req);
    /**
     * 更新客户证照管理es
     * @param req
     * @return
     */
    ResponseResult updateUserCompanyLicenseManager(UserCompanyLicenseManagerInitRequest req);

    /**
     * 客户证照管理分页查询
     * @param req
     * @return
     */
    Page<UserCompanyLicenseManagerEsCO> queryUserCompanyLicenseManagerPage(UserCompanyLicenseManagerRequest req);

    /**
     * 提供给客服使用的接口
     * @return
     */
    MultiResponse<UserCompanyInfoForCustomerServiceCO> queryUserCompanyInfoForCustomerService(String companyName, Long storeId);

    /**
     * 企业重复校验：根据企业名称+统一社会信用代码 校验
      * @param userCompanyRepeatCheckRequest
     * @return
     */
    ResponseResult<Boolean> userCompanyRepeatCheck(UserCompanyRepeatCheckRequest userCompanyRepeatCheckRequest);

    /**
     * 批量获取客户级redis缓存数据
     *
     * @param req 请求参数
     * @return 缓存对象
     */
    SingleResponse<Map<Long, CompanyAggRedisResponse>> batchQueryCompanyAggMapRedis(CompanyAggRedisQueryRequest req);

    SingleResponse<GetCompanyDataResponse> getCompanyDataForPlaceOrder(GetCompanyDataRequest request);

    /**
     * 提供给订单使用：能效平台-1000893-九州众采增加销售订单抽查审核功能和界面
     * 校验地址是否一致、证照是否过期
     * @param request
     * @return
     */
    SingleResponse<CompanyOrderCheckResponse> getCompanyOrderCheck(CompanyOrderCheckRequest request);


    /**
     * 根据企业id集合查询企业地址信息--商户中心黑名单需求需要
     * @param companyIdList
     * @return
     */
    MultiResponse<UserCompanyAddressInfoCO> getCompanyAddressInfoByIds(List<Long> companyIdList);

    PageResponse<UserCompanyAddressInfoCO> queryCompanyAddressInfoPage(CompanyInfoPageRequest req);

    MultiResponse<CompanySubCompanyTypeInfoResponse> selectSubCompanyTypeInfoList(CompanySubCompanyTypeInfoRequest qo);

    MultiResponse<CompanySubCompanyTypeInfoResponse> selectSubCompanyTypeInfoByCompanyId(List<Long> companyIdList);

    /**
     * 查询信贷信息
     * @param qry
     * @return
     */
    SingleResponse<QueryCreditDetailCO> queryCreditDetail(QueryCreditDetailQry qry);

}
