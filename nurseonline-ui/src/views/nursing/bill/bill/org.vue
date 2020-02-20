<template>
	<div>
		<bill :org-id="orgId" org></bill>
	</div>
</template>

<script>
	import bill from "./index.vue"
    import {currentOrg} from "@/api/nursing/org/org.js"
	
	export default {
		data(){
			return {
				orgId: -1
			}
		},
		components: {bill},
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