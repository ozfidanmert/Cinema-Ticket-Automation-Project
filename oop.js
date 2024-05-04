 const seats = document.querySelectorAll('.seat:not(.reserved)'); // Rezerve edilmemiş tüm koltukları seçer
const seatsAll = document.querySelectorAll('.seat')
const select = document.querySelector('#gun'); // select seçimini seçiciyi seçer
const amount = document.querySelector('#amount'); // Ödenecek tutarı gösterir
const count = document.querySelector('#count'); // Seçili koltuk sayısını gösterir
const container = document.querySelector('.container'); // Koltukları içeren ana konteyneri seçer
const payBtn = document.querySelector('.payBtn'); // Ödeme butonunu seçer
const clearBtn = document.querySelector('.clear')


let selectedSeat; // Seçili koltuk sayısını tutar
let selectedSeats = []; // Seçili koltukları tutar
let reservedSeats = []; // Rezerve edilmiş koltukları tutar
let totalCiro = 0




// Koltuklara tıklama olayını dinler
container.addEventListener('click', (e) => {
    if (e.target.classList.contains("seat") && !e.target.classList.contains("reserved")) {
        e.target.classList.toggle("selected"); // Tıklanan koltuğun seçili durumunu değiştirir        
        calculateTotal(); // Toplam tutarı hesaplar
    }

    if (e.target.classList.contains('reserved')) {
        const soru = confirm(`Bu koltuğu boş bırakmak istediğine emin misin?`)
        if (soru) {
            e.target.classList.remove('reserved')
        }
    }

    // Toplam tutarı hesaplar
    payment(); // Ödeme butonunun durumunu günceller
});


const seatHtml = (seatsAll) => {
    seatsAll.forEach((seat) => {
         seat.textContent = parseInt(seat.textContent) +1
    })
}


// Toplam tutarı hesaplar
const calculateTotal = () => {
    selectedSeats = document.querySelectorAll('.seat.selected'); // Seçili koltukları seçer
    reservedSeats = document.querySelectorAll('.seat.reserved'); // Rezerve edilmiş koltukları seçer

    const selectedSeatIndex = Array.from(selectedSeats).map(seat => Array.from(seats).indexOf(seat)); // Seçili koltukların dizinlerini alır

    const reservedSeatIndex = Array.from(reservedSeats).map(seat => Array.from(seats).indexOf(seat)); // Rezerve edilmiş koltukların dizinlerini alır


    selectedSeat = selectedSeats.length; // Seçili koltuk sayısını günceller
    count.textContent = Number(selectedSeat); // Seçili koltuk sayısını gösterir
    amount.textContent = select.value * selectedSeat; // Ödenecek tutarı hesaplar



    saveToLocalStorage(selectedSeatIndex, reservedSeatIndex); // Seçili koltukları local storage'a kaydeder
};




// Local storage'a kaydeder
const saveToLocalStorage = (selectedSeatIndex, reservedSeatIndex) => {

    localStorage.setItem("selectedSeats", JSON.stringify(selectedSeatIndex)); // Seçili koltukları local storage'a kaydeder
    localStorage.setItem('reservedSeats', JSON.stringify(reservedSeatIndex)); // Rezerve edilmiş koltukları local storage'a kaydeder
};

// Local storage'dan verileri alır ve sayfayı günceller
const getFromLocalStorage = () => {
    const selectedSeatIndex = JSON.parse(localStorage.getItem('selectedSeats')); // Local storage'dan seçili koltukların dizinlerini alır
    const reservedSeatIndex = JSON.parse(localStorage.getItem('reservedSeats')); // Local storage'dan rezerve edilmiş koltukların dizinlerini alır

    selectedSeatIndex.forEach(index => seats[index].classList.add('selected')); // Seçili koltukları işaretler
    reservedSeatIndex.forEach(index => seats[index].classList.add('reserved')); // Rezerve edilmiş koltukları işaretler
};

// Ödeme butonuna tıklama olayını dinler
payBtn.addEventListener('click', (e) => {

    const selectedSeatCount = selectedSeats.length
    const ticketPrice = parseInt(select.value)

    const totalTicketPrice = selectedSeatCount * ticketPrice
    totalCiro += totalTicketPrice

    alert(`Bu işlemle ${selectedSeatCount} adet bilet satıldı.\nToplam Tutar: ${totalTicketPrice} ₺`)

    selectedSeats.forEach(seat => {
        seat.classList.remove('selected'); // Seçili koltuklardan 'selected' sınıfını kaldırır
        seat.classList.add('reserved'); // Seçili koltuklara 'reserved' sınıfını ekler
    });

    // Seçili koltukları sıfırlar
    calculateTotal(); // Toplam tutarı hesaplar
    payment()
});

// Tüm reserved ve selected koltukları kaldırır
clearBtn.addEventListener('click', () => {

    const soru = confirm('Salon Temizlenecek. Onaylıyor Musun?')
    if (soru) {

        seatsAll.forEach(seat => {
            seat.classList.remove('reserved');
            seat.classList.remove('selected');
        });
        selectedSeats = [];
        reservedSeats = [];
        calculateTotal();
        payment();
        alert(`Salon Temizlendi!\nToplam Kazanılan Ciro: ${totalCiro} ₺`);
        totalCiro = 0
    }

});



// select seçimi değiştiğinde olayını dinler
select.addEventListener('change', () => {
    calculateTotal(); // Toplam tutarı hesaplar
});


// Ödeme butonunun durumunu kontrol eder
const payment = () => {
    if (selectedSeats.length > 0) {
        payBtn.classList.add('active'); // Ödeme butonunu aktif hale getirir
    } else {
        payBtn.classList.remove('active'); // Ödeme butonunu pasif hale getirir
    }
};

seatHtml(seatsAll)
// Local storage'dan verileri alır ve sayfayı günceller
getFromLocalStorage();
calculateTotal();
payment();
