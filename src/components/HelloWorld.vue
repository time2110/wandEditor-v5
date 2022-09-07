<template>
    <div>
        <button @click="insertText">insert text</button>
        <div style="border: 1px solid #ccc;text-align: left">
            <Toolbar
                    style="border-bottom: 1px solid #ccc"
                    :editor="editor"
                    :defaultConfig="toolbarConfig"
                    :mode="mode"
            />
            <Editor
                    style="height: 500px; overflow-y: hidden;"
                    v-model="html"
                    :defaultConfig="editorConfig"
                    :mode="mode"
                    @onCreated="onCreated"
                    @onChange="onChange"
                    @onDestroyed="onDestroyed"
            />
        </div>
        <button @click="handleClick">提交</button>
    </div>

</template>

<script>
    import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
    import {toolbarKeys} from '../assets/wangeditorConfig'
    import axios from "axios";

    export default {
        name: 'HelloWorld',
        components: {Editor, Toolbar},
        props: {
            msg: String
        },
        data() {
            return {
                editor: null,
                html: '<p><br></p><div data-w-e-type="video" data-w-e-is-void>\n' +
                    '<video poster="视频" controls="true" width="auto" height="auto"><source src="/third/tsysfile/cnzzw/6cad2ad940844d37b6a432f9285b7ca8.mp4" type="video/mp4"/></video>\n' +
                    '</div><p><br></p>',
                // 工具栏配置
                toolbarConfig: {
                    toolbarKeys
                },
                // 编辑器配置
                editorConfig: {
                    placeholder: '请输入内容...',
                    // 配置编辑器是否只读 可通过 editor.enable() 和 editor.disable() 切换
                    readOnly: false,
                    // 配置编辑器默认是否 focus
                    autoFocus: false,
                    // 配置编辑器是否支持滚动 false: 编辑器高度自增
                    scroll: true
                },
                mode: 'default', // or 'simple'
            }
        },
        created() {

        },
        methods: {
            handleClick() {
                console.log(this.html)
            },
            // 编辑器创建完毕时
            onCreated(editor) {
                let that = this
                this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
                // 查看所有工具栏key
                // console.log(this.editor.getAllMenuKeys())
                // 获取菜单的默认配置
                let config = this.editor.getConfig()
                config.MENU_CONF['uploadImage'] = {
                    // // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
                    allowedFileTypes: ['image/*'],
                    async customUpload(file, insertFn) {
                        const isJPG = file.type.split('/')[0] == 'image'
                        const is5M = file.size <= 5 * 1024 *1024
                        if(!isJPG) {
                            that.$message.error('请上传图片')
                            return
                        }else if(!is5M) {
                            that.$message.error('上传图片不能超过5M')
                            return
                        }
                        let formData = new FormData();
                        formData.append("file", file);
                        const loading = that.$loading({
                            lock: true,
                            text: '上传文件中...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        try {
                            const res = await axios.post('/third/tplatdocfile/upload', formData)
                            const {data, errno, msg} = res.data
                            if(errno==0) {
                                insertFn(data.url, '图片', data.url);
                            }else {
                                that.$message.error(msg)
                            }
                        }catch (e) {
                            that.$message.error('图片上传错误！')
                        }finally {
                            loading.close()
                        }

                    }
                }
                config.MENU_CONF['uploadVideo'] = {
                    // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
                    allowedFileTypes: ['video/*'],
                    async customUpload(file, insertFn) {
                        const isJPG = file.type.split('/')[0] == 'video'
                        const is5M = file.size <= 100 * 1024 *1024
                        if(!isJPG) {
                            that.$message.error('请上传视频！')
                            return
                        }else if(!is5M) {
                            that.$message.error('上传视频不能超过5M！')
                            return
                        }
                        let formData = new FormData();
                        formData.append("file", file);
                        const loading = that.$loading({
                            lock: true,
                            text: '上传文件中...',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });
                        try {
                            const res = await axios.post('/third/tplatdocfile/upload', formData)
                            const {data, errno, msg} = res.data
                            if(errno==0) {
                                insertFn(data.url, '视频', data.url);
                            }else {
                                that.$message.error(msg)
                            }
                        }catch (e) {
                            that.$message.error('视频上传错误！')
                        }finally {
                            loading.close()
                        }
                    },
                    // 自定义插入视频
                    customInsert(result) {  //
                        console.log('-------------')
                        // 从 res 中找到 url poster ，然后插入视频
                        let videoHTML = '&nbsp;<video src="' + result.data.url + '" controls style="max-width:100%" autoplay="autoplay" class="video"></video>&nbsp;';
                        that.editor.cmd.do('insertHTML', videoHTML);
                    }
                }
            },
            // 编辑器内容、选区变化时
            onChange(editor) {
                console.log('onChange', editor.children)
            },
            // 编辑器销毁时
            onDestroyed(editor) {
                console.log('onDestroyed', editor)
            },
            insertText() {
                console.log(this.editor?.getHtml())
            },
        },
        mounted() {
            // 模拟 ajax 请求，异步渲染编辑器
            setTimeout(() => {
                // this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
                // let editor = this.editor.getConfig()
                // console.log(editor.MENU_CONF['uploadVideo'])
                // console.log(editor.MENU_CONF['uploadImage'])
                // // 查看所有工具栏key
                // console.log(this.editor.getAllMenuKeys())
            }, 1500)
        },
        beforeDestroy() {
            const editor = this.editor
            if (editor == null) return
            editor.destroy() // 组件销毁时，及时销毁编辑器
        }
    }
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
    .w-e-textarea-video-container {
        /*background-image: unset;*/
        /*border: unset;*/
        /*text-align: left;*/
    }
</style>
