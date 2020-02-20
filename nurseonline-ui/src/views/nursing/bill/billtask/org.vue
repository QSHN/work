<template>
	<div>
		<billtask :org-id="orgId" org></billtask>
	</div>
</template>

<script>
    import billtask from "./billtask.vue"
    import {currentOrg} from "@/api/nursing/org/org.js"
	
	export default {
		data(){
			return {
				orgId: -1
			}
		},
        components: {billtask},
        mounted(){
            currentOrg().then(res => {
				console.log(res)
				if(res.data.data){
					this.orgId = res.data.data.orgId;
				}
            }).catch();
        }
	}
</script>