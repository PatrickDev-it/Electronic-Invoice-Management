import addHttpsProtocol from '../add-https-protocol';

export default params => {
	return `<table
    width="500px"
    bgcolor="#fff"
    align="center"
    style="color: ${params.color_message};"
>
    <tbody>
        <tr>
            <td>
                <table align="center" cellPadding="10">
                    <tbody>
                        <tr>
                            <td>
                                <img
                                    src="${params.logo}"
                                    width="150"
                                    height="150"
                                    alt="${params.company_name}"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table
                    bgcolor="${params.bg_header}"
                    width="100%"
                    cellPadding="20"
                >
                    <tbody>
                        <tr>
                            <td align="center">
                                <span style="text-transform:uppercase; font-weight:bold; color: ${params.color_header};">
                                    ${params.mail_object}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table
                    bgcolor="${params.bg_message}"
                    cellPadding="20"
                    width="100%"
                    style="color: ${params.color_message};">
                    <tbody>
                        <tr>
                            <td>${params.message}</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        <tr>
            <td
                align="center"
                style="font-style:italic; color:${params.color_footer};">
                ${params.company_name}
            </td>
        </tr>

        <tr>
            <td>
                <table
                    cellPadding="5"
                    align="center"
                    style="font-size:12px; color:${params.color_footer};">
                    <tbody>
                        <tr>
                            ${
						params.email &&
						`<td><a href="mailto:${params.email}" style="font-size:12px; color:${params.color_footer};">${params.email}</a></td>`
					}
                            ${(params.phone ?? params.telefono) && `<td>${params.phone ?? params.telefono}</td>`}
                        </tr>
                        <tr>
                            ${
						params.website &&
						`<td colSpan="2" align="center">
                                    <a
                                        href="${addHttpsProtocol(params.website)}"
                                        style="font-size:12px; color:${params.color_footer};">
                                        ${params.website}
                                    </a>
                                </td>`
					}
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>`;
};
