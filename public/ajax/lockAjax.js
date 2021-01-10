const changeLockStatus = async(btn) => {
    const customerId = btn.parentNode.querySelector('[name=customerId]').value;
    const fetchData = await fetch('/customer/lock/status/' + customerId, {
            method: 'PUT'
        })
        .then(result => {
            return result.json();
        })
        .then(data => {
            if (btn.classList.contains('lock-btn')) {
                btn.classList.remove('lock-btn');
                btn.classList.add('unlock-btn');
                btn.innerText = 'Unlock this user';
                swal({
                    title: `Customer #${customerId}`,
                    text: "is locked",
                    icon: "success",
                });
            } else if (btn.classList.contains('unlock-btn')) {
                btn.classList.remove('unlock-btn');
                btn.classList.add('lock-btn');
                btn.innerText = 'Lock this user';
                swal({
                    title: `Customer #${customerId}`,
                    text: "is unlocked",
                    icon: "success",
                });
            }

        });
}

const changeAdminLockStatus = async(btn) => {
    const adminId = btn.parentNode.querySelector('[name=adminId]').value;
    const fetchData = await fetch('/admins/lock/status/' + adminId, {
            method: 'PUT'
        })
        .then(result => {
            return result.json();
        })
        .then(data => {
            if (btn.classList.contains('lock-btn')) {
                btn.classList.remove('lock-btn');
                btn.classList.add('unlock-btn');
                btn.innerText = 'Unlock this admin';
                swal({
                    title: `Customer #${adminId}`,
                    text: "is locked",
                    icon: "success",
                });
            } else if (btn.classList.contains('unlock-btn')) {
                btn.classList.remove('unlock-btn');
                btn.classList.add('lock-btn');
                btn.innerText = 'Lock this admin';
                swal({
                    title: `Customer #${adminId}`,
                    text: "is unlocked",
                    icon: "success",
                });
            }

        });
}