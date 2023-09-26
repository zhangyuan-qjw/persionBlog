<template>
    <!-- <transition name="slide-down" mode="out-in"> -->
    <div class="global-dialog" :class="Dialog ? 'active' : ''">
        <div class="dialog-content">
            <slot></slot>
        </div>
    </div>
</template>
  
<script lang="ts" setup>

defineProps({
    Dialog: {
        type: Boolean,
        required: true
    }
})

</script>
  
<style lang="scss" scoped>
.global-dialog {
    height: 40px;
    width: 140px;
    background-color: black;
    font-weight: 600;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-left: 20px;
    position: absolute;
    top: 3.5rem;
    box-shadow: 0 0 10px #ccc;
    //左右居中
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    //动画
    transition: all 0.5s;
    //隐藏
    visibility: hidden;
    opacity: 0;
    z-index: 999;
}

.global-dialog.active {
    opacity: 1;
    visibility: visible;
    top: 4rem;
}
</style>
  