<!-- editor -->
<template>
  <div>
    <AceEditor
      v-model="value"
      @init="init"
      :enableBasicAutocompletion="true"
      :enableLiveAutocompletion="true"
      :enableSnippets="true"
      :options="cmOptions"
      lang="python"
      theme="chrome"
      width="100%"
      height="260px"
    />
  </div>
</template>

<script>
import AceEditor from "vue2-ace-editor";
// 语法提示工具
import "brace/ext/language_tools"; //language extension prerequsite...
import "brace/ext/searchbox"; //language extension prerequsite...
import "brace/mode/xml";
import "brace/snippets/xml"; //snippet
import "brace/theme/chrome";
import "brace/ext/emmet";

export default {
  name: "editor",
  props: {
    content: {
      type: String,
      required: false,
      default: () =>
        `def assert(response):
    return response`
    },
    readOnly: {
      required: false,
      default: false
    }
  },
  data() {
    return {
      cmOptions: {
        readOnly: this.readOnly,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
      },
      editor: null
    };
  },
  methods: {
    init(editor) {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/python");
      require("brace/snippets/python"); //snippet
      //   editor.on("change", this.change);
      //   editor.commands.addCommand({
      //     name: "save",
      //     bindKey: { win: "Ctrl-S", mac: "Command-S" },
      //     exec: editor => this.$emit("save-change", this.value, editor)
      //   });
      //   editor.commands.addCommand({
      //     name: "formatter",
      //     bindKey: { win: "Ctrl-Shift-F", mac: "Command-Shift-F" },
      //     exec: () => this.$emit("formatter", this.editor)
      //   });
      // },
      // change() {
      //   setTimeout(() => {
      //     this.$emit("editor-change", this.codeContent_);
      //   }, 10);
    }
  },
  computed: {
    value: {
      get() {
        return this.content;
      },
      set(v) {
        this.$emit("update:content", v);
      }
    }
  },
  mounted() {},
  created() {},
  components: {
    AceEditor: AceEditor
  }
};
</script>