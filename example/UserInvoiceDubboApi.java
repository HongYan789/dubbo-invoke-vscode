package com.jzt.zhcai.user.userInvoice;



import com.jzt.zhcai.user.userInvoice.co.UserInvoiceCO;
import com.jzt.zhcai.user.userInvoice.dto.UserInvoiceQry;
import com.jzt.zhcai.user.userb2b.dto.CompanyInvoiceDTO;

import java.util.List;

public interface UserInvoiceDubboApi {


    void saveInvoice(UserInvoiceQry userInvoiceQry);

    List<CompanyInvoiceDTO> queryInvoice(List<Long> companyIds);

}
