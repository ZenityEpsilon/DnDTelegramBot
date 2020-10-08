<template>
	<div id="page-2">
		This is a page that has Composition API
		<vue-title />
	</div>
</template>

<script>
import useCounter from '../compositions/useCounter';
import godcode from '../assets/godcode.jpg';

export default {
	name: 'botex',
	setup() {
		const { counter, incrementCounter } = useCounter();

		return { counter, incrementCounter, godcode };
	},
};
</script>

<style lang="scss" scoped>
#page-2 {
	.counter {
		margin-bottom: 20px;
	}
}
</style>
