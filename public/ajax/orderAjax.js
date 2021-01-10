const confirmOrder = async(btn) => {
    const orderId = btn.parentNode.querySelector('[name=orderId]').value;
    const fetchData = await fetch('/order/confirm/' + orderId, {
            method: 'PUT'
        })
        .then(result => {
            return result.json();
        })
        .then(data => {
            btn.classList.remove('unconfirmed-btn');
            btn.classList.add('confirmed-btn');
            btn.onclick = function() {
                return true;
            }
            btn.innerText = 'Confirmed';
            swal({
                title: ` Order #${orderId}`,
                text: "is confirmed",
                icon: "success",
            });
        });
}