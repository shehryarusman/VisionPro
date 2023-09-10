<script>
export default {
    props: ["letter"]
};
</script>

<template>
    <div>
        <img v-if="letter === 'a'" src="../assets/img/letters/a.png">
        <img v-if="letter === 'b'" src="../assets/img/letters/b.png">
        <img v-if="letter === 'c'" src="../assets/img/letters/c.png">
        <img v-if="letter === 'd'" src="../assets/img/letters/d.png">
        <img v-if="letter === 'e'" src="../assets/img/letters/e.png">
        <img v-if="letter === 'f'" src="../assets/img/letters/f.png">
        <img v-if="letter === 'g'" src="../assets/img/letters/g.png">
        <img v-if="letter === 'h'" src="../assets/img/letters/h.png">
        <img v-if="letter === 'i'" src="../assets/img/letters/i.png">
        <img v-if="letter === 'j'" src="../assets/img/letters/j.png">
        <img v-if="letter === 'k'" src="../assets/img/letters/k.png">
        <img v-if="letter === 'l'" src="../assets/img/letters/l.png">
        <img v-if="letter === 'm'" src="../assets/img/letters/m.png">
        <img v-if="letter === 'n'" src="../assets/img/letters/n.png">
        <img v-if="letter === 'o'" src="../assets/img/letters/o.png">
        <img v-if="letter === 'p'" src="../assets/img/letters/p.png">
        <img v-if="letter === 'q'" src="../assets/img/letters/q.png">
        <img v-if="letter === 'r'" src="../assets/img/letters/r.png">
        <img v-if="letter === 's'" src="../assets/img/letters/s.png">
        <img v-if="letter === 't'" src="../assets/img/letters/t.png">
        <img v-if="letter === 'u'" src="../assets/img/letters/u.png">
        <img v-if="letter === 'v'" src="../assets/img/letters/v.png">
        <img v-if="letter === 'w'" src="../assets/img/letters/w.png">
        <img v-if="letter === 'x'" src="../assets/img/letters/x.png">
        <img v-if="letter === 'y'" src="../assets/img/letters/y.png">
        <img v-if="letter === 'z'" src="../assets/img/letters/z.png">
        <img v-if="letter === '0'" src="../assets/img/letters/0.png">
        <img v-if="letter === '1'" src="../assets/img/letters/1.png">
        <img v-if="letter === '2'" src="../assets/img/letters/2.png">
        <img v-if="letter === '3'" src="../assets/img/letters/3.png">
        <img v-if="letter === '4'" src="../assets/img/letters/4.png">
        <img v-if="letter === '5'" src="../assets/img/letters/5.png">
        <img v-if="letter === '6'" src="../assets/img/letters/6.png">
        <img v-if="letter === '7'" src="../assets/img/letters/7.png">
        <img v-if="letter === '8'" src="../assets/img/letters/8.png">
        <img v-if="letter === '9'" src="../assets/img/letters/9.png">
        <img v-if="letter === '10'" src="../assets/img/letters/10.png">
    </div>
</template>