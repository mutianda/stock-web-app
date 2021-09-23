<template>
	<div class="login-page">
		<div class="login_box">
			<!-- 登录表单区域 -->
			<el-form size="mini" :model="loginForm" ref="loginForm" :rules="rules">
				<!-- 用户名 -->
				<el-form-item prop="userName">
					<el-input placeholder="用户名" v-model="loginForm.userName"  ><i slot="prefix" class="el-icon-user"></i></el-input>
				</el-form-item>
				<!-- 密码 -->
				<el-form-item prop="password">
					<el-input placeholder="密码" show-password v-model="loginForm.password" > <i slot="prefix" class="el-icon-setting"></i></el-input>
				</el-form-item>
				<!-- 登录按钮 -->
				<el-form-item>
					<el-button type="danger" @click="login">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		name: "index",
		data(){
			return {
				loginForm:{
					userName:'',
					password:''
				},
				rules: {
					userName:[ { required: true, message: '请输入手机号或邮箱', trigger: 'blur' },],
					password:[ { required: true, message: '请输入密码', trigger: 'blur' },]

				}
			}
		},
		methods:{
			login(){
				this.$refs['loginForm'].validate((valid) => {
					if (valid) {
						this.$_api.common.login(this.loginForm).then(res => {
							if (res.code == 200) {
								this.$message.success('登陆成功')
								const {user_email: email} = res.data
								const user = {
									email
								}
								localStorage.setItem('user', JSON.stringify(user))
								location.reload()
							} else {
								this.$message.error(res.msg)
							}
						})
					} else {

					}
				})

			}
		}
	}
</script>

<style scoped>
	.login-page {
		background-image: linear-gradient(-180deg, #870c0c 0%, #ee555a 100%);
		/*background-image: url("../images/bg_login.png");*/
		background-repeat: no-repeat;
		background-size: cover;
		height: 100%;
	}
	.login_box {
		width: 290px;
		height: 200px;
		/* background-color: #fff; */
		background-color: rgba(123, 46, 61, 0.7);
		border-radius: 5px;

		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	.el-form {
		padding: 32px;
		position: absolute;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
	}
	.el-button {
		width: 100%;
	}
	.code {
		width: 45%;
	}

	.rememberMe {
		color: #fff;
	}


</style>