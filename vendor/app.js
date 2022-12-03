let products = [];

function toshow(x){
    $(".products").empty();
    
    x.map(product=>{
        $(".products").append(`
         <div class=" col-lg-4 mb-5">
            <div class="card product">
                <img src="${product.image}" class=" " alt="">
                <div class="card-body border-0 rounded-2 shadow">
                    <h5 class="fw-bold text-primary">${toshort(product.title , 30)}</h5>
                    <p class= " text-black-50">${toshort(product.description , 90)}</p>

                    <div class=" d-flex justify-content-between align-items-center  mt-5">
                        <span>${product.price}</span>
                        <button class=" btn btn-sm border border-2 rounded-2 border-primary text-primary add-to-card" data-id="${product.id}">Add <i class="fa-solid fa-cart-shopping"></i>  </button>
                    </div>
                </div>
            </div>
         </div>
        `);
    });
};

function toshort(x, max=50){
    if(x.length > max){
       return  x.substring(0,max) + "...";
    }

    return x;
}

//products data 
$.get("https://fakestoreapi.com/products" , function(data){
    console.log(data);
    products = data;
    
    toshow(products);
    
});

$("#search").on("keyup" , function(){
    let keyword = $(this).val().toLowerCase();
    // console.log(keyword);

  if(keyword.trim().length >= 1){
    let productFilter =   products.filter(function(el){
            if(el.title.toLowerCase().indexOf(keyword) > -1 || el.description.toLowerCase().indexOf(keyword) > -1 ){
                return products
            }
    });

    toshow(productFilter);
  }else{
      return toshow(products);
  };

});

//categories
$.get("https://fakestoreapi.com/products/categories" , function(data){
    data.map(el=> {
        $("#category").append(`
            <option value="${el}">${el}</option>
        `)
    });
});

$("#category").on("change" , function(){
    let selected = $(this).val();

    if(selected != 0){
        let productFilter =   products.filter(function(el){
            if(el.category === selected ){
                return products
            }
    });

    toshow(productFilter);
    }else{
        toshow(products);
    }

    
    
})

function cardTotal(){

    let count = $(".item-in-card").length;

    $(".item-in-cart-count").html(count);

    
    if(count > 0){
        let totalcost =   $(".item-in-card-cost").toArray().map(el=>el.innerHTML).reduce((x,y)=>{
            let total = Number(x)+Number(y);
            return total.toFixed(2);
        });

        $(".total").html(`
                <div class="card">
                    <div class="card-body p-2 bg-light border border-0 rounded">
                        <div class=" d-flex justify-content-between align-items-center px-2">
                            <h3>Total Cost</h3>
                            <h3>$ <span class=" ">${totalcost}</span></h3>
                        </div>
                    </div>
                </div>
        `);

        // $(".empty-card").addClass("d-none");

    }else{

        $(".total").html(`
            <div class="col-12 vh-100 d-flex justify-content-center   align-items-center empty  ">
                <h4 class=" text-black-50 ">Empty Card </h4>
            </div>
        `);
    }

}

$(".products").delegate(".add-to-card" , "click" , function(){
    let productId = $(this).attr("data-id");
    let productinfo = products.filter(el=>el.id == productId)[0];
    
    
    if($(".item-in-card").toArray().map(el=>el.getAttribute("data-id")).includes(productId)){

    }else{

        $(".cards").append(`

                <div class="card my-2 item-in-card" data-id="${productinfo.id}">
                    <div class="card-body py-2  border rounded">
                        <div class="d-flex justify-content-between align-items-center">
                            <img src="${productinfo.image}" class="img-in-card" alt="">
                            <button class=" btn btn-outline-danger remove-from-card">
                                <i class="fa-solid fa-trash-can "></i>
                            </button>
                        </div>
                        <div ><p>${productinfo.title}</p></div>
                        <div class="d-flex justify-content-between align-items-end">
                            <div class=" ">
                                <button class=" btn btn-sm btn-outline-primary quantity-minus">
                                    <i class="fa-solid fa-minus"></i>
                                </button>
                                <input type="number" unit-price="${productinfo.price}" min="1" value="1" class=" quantity-total  form-control-sm w-25">
                                <button class=" btn btn-sm btn-outline-primary quantity-plus">
                                    <i class="fa-solid fa-plus "></i>
                                </button>
                            </div>
                            <h4 class="mb-0">$ <span class="item-in-card-cost">${productinfo.price}</span></h4>
                        </div>
                    </div>
                </div>
    `);

    

    };

    cardTotal();
   


});

$(".cards").delegate(".remove-from-card" , "click" , function(){

            console.log("hello");
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
                })
    
                swalWithBootstrapButtons.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
                }).then((result) => {
                if (result.isConfirmed) {
                    $(this).parentsUntil(".cards").remove();
                    cardTotal();
                    swalWithBootstrapButtons.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                    )
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                    )
                }
                })
            
        
               
})

$(".cards").delegate(".quantity-plus" , "click" , function(){
    let a = $(this).siblings(".quantity-total").val();
    let newA = Number(a)+1;

    let b = $(this).siblings(".quantity-total").attr("unit-price");
    let newB = b*newA;

    $(this).siblings(".quantity-total").val(newA);
    $(this).parent().siblings("h4").find(".item-in-card-cost").html(newB);
    cardTotal();
});


$(".cards").delegate(".quantity-minus" , "click" , function(){
    let a = $(this).siblings(".quantity-total").val();
    let newA = Number(a)-1;

    let b = $(this).siblings(".quantity-total").attr("unit-price");
    let newB = b*newA;

    if(a>1){
        $(this).siblings(".quantity-total").val(newA);
        $(this).parent().siblings("h4").find(".item-in-card-cost").html(newB);
        cardTotal();
    }
});



$(".cards").delegate(".quantity-total" , "keyup change" , function(){
    let a = $(this).val();

    let b = $(this).attr("unit-price");
    let newB =  b*a ;

    if(a>1){
        
        $(this).parent().siblings("h4").find(".item-in-card-cost").html(newB);
        cardTotal();
    }
})


$('.cards').delegate('.remove-form-card' , 'click' , function(){
    console.log("hello");
    
})