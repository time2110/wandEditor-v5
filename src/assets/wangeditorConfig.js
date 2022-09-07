// 工具栏配置
export const toolbarKeys = [
    'headerSelect',
    'bold',
    'fontSize',
    'fontFamily',
    'italic',
    'underline',
    'through',
    {
        key: 'group-indent', // 必填，要以 group 开头
        title: '缩进', // 必填
        iconSvg: '',
        menuKeys: [
            'indent',
            'delIndent',
        ]
    },
    'lineHeight',
    'color',
    'bgColor',
    'insertLink',
    // 菜单组，包含多个菜单
    {
        key: 'group-list', // 必填，要以 group 开头
        title: '列表', // 必填
        menuKeys: [
            'bulletedList',
            'numberedList',
        ]
    },
    {
        key: 'group-align', // 必填，要以 group 开头
        title: '对齐', // 必填
        menuKeys: [
            'justifyLeft',
            'justifyRight',
            'justifyCenter',
            'justifyJustify',
        ]
    },
    'uploadImage',
    'uploadVideo',
    'insertTable',
    'divider',
    'undo',
    'redo',
    'fullScreen'
]