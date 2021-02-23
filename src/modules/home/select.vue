<script>
import permission from '@/utils/permission';

export default {
  created() {
    this.gotoDesktop();
  },
  methods: {
    gotoDesktop() {
      let path;
      if (permission.hasPermission('uban.carerui.home')) {
        path = '/home/home';
      } else if (permission.hasPermission('uban.carerui.carerhome'))  {
        path = '/orderly/index';
      } else {
        path = '/console/403';
      }
      this.$router.replace(path);
    }
  },
}
</script>