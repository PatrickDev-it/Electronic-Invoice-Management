export default params => {
	return `<div style="display:flex; justify-content: center; align-items: center; width:100%;">
	<div style="max-width:300px;">
		<div style="width:300px; border-radius:10px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); overflow:hidden;">
            <div style="display:flex; align-items:center; justify-content: center; height:130px; background-color: ${params.bg_header};">
				<div style="padding: 0.5rem; text-align:center;">
					<img
						src="${params.logo}"
						style="max-width:130px; max-height:130px; width:100%; display:inline-block;"                    
						alt="${params.company_name}"
					/>
				</div>
			</div>
			<div
				style="display:flex; justify-content: space-between; align-items: flex-end; padding-left: 1.25rem;
				padding-right: 1.25rem; padding-top: 0.5rem;
				padding-bottom: 0.5rem; background-color: ${params.bg_footer}; color: ${params.color_footer};"                    
			>
				<div style="font-size:50px; font-weight:bold; line-height: 1;">
					${params.amount}${params.type === 'percentage' ? '%' : '€'}
				</div>
				<div style="font-style:italic;">Happy Birthday</div>
			</div>
		</div>
		<div style="color:#000; text-align:center; margin-top: 1rem;">
			Coupon Code:
		</div>
		<div style="color:#000; text-align:center; font-style:italic;">
			${params.code}
		</div>		
		<div style="color:#acacac;  margin-top: 0.5rem; line-height: 1; font-style:italic; font-size:10px; padding: 0.5rem; text-align:center;">
		Valid until ${params.expire_date}
		</div>
	</div>
</div>
     `;
};
